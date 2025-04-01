
class User{
    #user;
    #email;
    #password;

    constructor(user, email, password){
        this.#user = user;
        this.#email = email;
        this.#password = password;
    }

    // Getter
    getUser() { 
        return this.#user;
    }
    getEmail() {
        return this.#email;
    }
    getPassword() {
        return this.#password;
    }

    // Setter
    setUser(user) {
        this.#user = user;
    }
    setEmail(email) {
        this.#email = email;
    }
    setPassword(password) {
        this.#password = password;
    }

}