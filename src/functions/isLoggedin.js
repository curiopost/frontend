function isLoggedIn() {

const token = window.localStorage.getItem("token")

if(!token) {

    return {
        loggedIn: false,
        data: null
    }

}

}

export default isLoggedIn