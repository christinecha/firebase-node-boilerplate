import firebase from 'firebase/app'
import 'firebase/database'
import { config, namespace } from './firebase.config'

const TEXT_STORAGE_ID = 'text'

class Blackboard {
  constructor() {
    this.$blackboard = document.getElementById('blackboard')

    this.handleKeyup = this.handleKeyup.bind(this)

    this.connectToFirebase()

    this.populate().then(() => {
      this.addEventListeners()
    })
  }

  connectToFirebase() {
    firebase.initializeApp(config)
    this.db = firebase.database().ref(namespace)
  }

  populate() {
    return new Promise(resolve => {
      this.db.child(TEXT_STORAGE_ID).on('value', snapshot => {
        const text = snapshot.val()
        this.$blackboard.value = text
        resolve()
      })
    })
  }

  handleKeyup(e) {
    this.db.child(TEXT_STORAGE_ID).set(this.$blackboard.value)
  }

  addEventListeners() {
    window.addEventListener('keyup', this.handleKeyup)
  }
}

new Blackboard()