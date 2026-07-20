import * as k8s from "@kubernetes/client-node";
import crypto from 'node:crypto'

const kc = new k8s.KubeConfig();

process.env.NODE_ENV === 'development' ? kc.loadFromDefault() : kc.loadFromCluster();



const customApi = kc.makeApiClient(k8s.CustomObjectsApi);
const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);
const networkingApi = kc.makeApiClient(k8s.NetworkingV1Api);

const GROUP = "stable.dwk"
const VERSION = "v1";
const PLURAL = "dummysites";

const urlHash = (url) => crypto.createHash("sha256").update(url).digest("hex").slice(0,12)

const ownerReferenceFor = (site) => ({
    apiVersion: "stable.dwk/v1",
    kind: "DummySite",
    name: site.metadata.name,
    uid: site.metadata.uid,
    controller: true,
    blockOwnerDeletion: true
});

const isNotFound = (err) => err?.code === 404;

const buildDeployment = (site) => {
    const name = `dummy-${site.metadata.name}`;
    const namespace = site.metadata.namespace;
    const url = site.spec.website_url;
    const hash = urlHash(url);

    const labels = {
        app: name,
        "stable.dwk/dummysite": site.metadata.name
    };

    return {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
            name,
            namespace,
            labels,
            ownerReferences: [ownerReferenceFor(site)]
        },
        spec: {
            replicas: 1,
            selector: { matchLabels: labels },
            template: {
                metadata: {
                    labels,
                    annotations: {
                        "stable.dwk/url-hash": hash
                    }
                },
                spec: {
                    volumes: [
                        {
                            name: "site-content",
                            emptyDir: {}
                        }
                    ],
                    containers: [
                        {
                            name: "fetcher",
                            image: "curlimages/curl:8.12.1",
                            env: [
                                {
                                    name: "URL",
                                    value: url
                                }
                            ],
                            command: [
                                "/bin/sh",
                                "-c",
                                `
                                curl --fail --location --silent --show-error "$URL" \
                                    --output /site/index.html &&
                                tail -f /dev/null
                                `
                            ],
                            volumeMounts: [
                                {
                                name: "site-content",
                                mountPath: "/site"
                                }
                            ]
                        },
                        {
                            name: "nginx",
                            image: "nginx:1.27-alpine",
                            ports: [{ containerPort: 80 }],
                            volumeMounts: [
                                {
                                name: "site-content",
                                mountPath: "/usr/share/nginx/html",
                                readOnly: true
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
}

const buildService = (site) => {
  const name = `dummy-${site.metadata.name}`;
  const namespace = site.metadata.namespace;

  const labels = {
    app: name,
    "stable.dwk/dummysite": site.metadata.name
  };

  return {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name,
      namespace,
      ownerReferences: [ownerReferenceFor(site)]
    },
    spec: {
      type: "ClusterIP",
      selector: labels,
      ports: [
        {
          name: "http",
          port: 80,
          targetPort: 80
        }
      ]
    }
  };
};

const buildIngress = (site) => {
  const name = `dummy-${site.metadata.name}`;
  const namespace = site.metadata.namespace;

  return {
    apiVersion: "networking.k8s.io/v1",
    kind: "Ingress",
    metadata: {
      name,
      namespace,
      ownerReferences: [ownerReferenceFor(site)]
    },
    spec: {
      rules: [
        {
          http: {
            paths: [
              {
                path: `/dummy/${site.metadata.name}`,
                pathType: "Prefix",
                backend: {
                  service: {
                    name,
                    port: { number: 80 }
                  }
                }
              }
            ]
          }
        }
      ]
    }
  };
};

const ensureDeployment = async (deployment) => {
  const { name, namespace } = deployment.metadata;

  try {
    const existing = await appsApi.readNamespacedDeployment({ name, namespace });

    deployment.metadata.resourceVersion = existing.metadata.resourceVersion;

    await appsApi.replaceNamespacedDeployment({
      name,
      namespace,
      body: deployment
    });

    console.log(`Updated Deployment: ${name}`);
  } catch (err) {
    if (!isNotFound(err)) throw err;

    await appsApi.createNamespacedDeployment({
      namespace,
      body: deployment
    });

    console.log(`Created Deployment: ${name}`);
  }
};
const ensureService = async (service) => {
  const { name, namespace } = service.metadata;

  try {
    await coreApi.readNamespacedService({ name, namespace });
    console.log(`Service already exists: ${name}`);
  } catch (err) {
    if (!isNotFound(err)) throw err;

    await coreApi.createNamespacedService({
      namespace,
      body: service
    });

    console.log(`Created Service: ${name}`);
  }
};

const ensureIngress = async (ingress) => {
  const { name, namespace } = ingress.metadata;

  try {
    await networkingApi.createNamespacedIngress({
      namespace,
      body: ingress
    });

    console.log(`Created Ingress: ${name}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`Ingress ${name} already exists`);
      return;
    }

    throw error;
  }
};
const reconcileDummySite = async (site) => {
  if (!site.spec?.website_url) {
    console.error(`DummySite ${site.metadata.name} has no website_url`);
    return;
  }

  await ensureDeployment(buildDeployment(site));
  await ensureService(buildService(site));
  await ensureIngress(buildIngress(site));
};

// const createDummyPage = async (site) => {
//     const name = `dummy-${site.metadata.name}`;
//     const namespace = site.metadata.namespace;
//     const url = site.spec.website_url;

//     const configMap = {
//         metadata: {
//             name,
//             namespace
//         },
//         data: {
//             "index.html": `
//             <h1>Dummy website</h1>
//             <p>URL: ${url}`
//         }
//     };

//     try {
//         console.log({ name, namespace, url });
//         await coreApi.createNamespacedConfigMap({namespace, body: configMap});
//         console.log(`Created ConfigMap: ${name}`);
//     } catch (error) {
//         if (error.code === 409) {
//             console.log(`ConfigMap ${name} already exists`)
//             return;
//         };
//         throw error;        
//     }
// }

const main = async () => {
    while (true) {

        try {

            const response = await customApi.listNamespacedCustomObject({
                group: GROUP,
                version: VERSION,
                plural: PLURAL,
                namespace: "default"
            });

            const sites = response.items;

            for (const site of sites) {
                await reconcileDummySite(site);
            };

            console.log('Reconciliation complete; waiting 10 seconds');
            
        } catch (error) {
            console.error("Reconciliation failed:", error);
        }
        
        await new Promise((resolve) => setTimeout(resolve, 10_000));

    };
    
}
main().catch(console.error)