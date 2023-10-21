# Monnify-Nodejs-lib
This is Nodejs wrapper for the Monnify API

---

### Table of Contents

- [Monnify-Nodejs-lib](#monnify-nodejs-lib)
    - [Table of Contents](#table-of-contents)
      - [Technologies](#technologies)
  - [To contribute](#to-contribute)
      - [Already Have node runtime Installed](#already-have-node-runtime-installed)
    - [Test](#test)

---

#### Technologies
This library was built and tested with node(version 16.14), but should also work for other versions. 

- axios
- crypto
  
[Back To The Top](#read-me-template)

---

## To contribute
#### Already Have node runtime Installed
```bash
clone the repo:

git clone https://github.com/Monnify/Monnify-Nodejs-lib.git

change to Monnify-Nodejs-lib directory:

cd Monnify-Nodejs-lib

install dependencies:

run npm install


set necessary environment variables:
    for *nix operating systems (MacOs and Linux)
            export SECRET={your monnify secret key}
            export APIKEY = {your monnify API key}
            export CONTRACT - {your monnif contract code}
            export WALLETACCOUNTNUMBER = {your monnify wallet account number}
            export MONNIFY_IP=35.242.133.146

    for windows OS
    You can use the set command
            set SECRET={your monnify secret key}
            
```

---

### Test
After Installation, you can run tests by running
```bash
npm test
```
---








