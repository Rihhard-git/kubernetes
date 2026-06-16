const generateRandomString = () => {

    const randomString = crypto.randomUUID()

    console.log(new Date, ":",randomString)

    setTimeout(generateRandomString, 5000)
}

generateRandomString()