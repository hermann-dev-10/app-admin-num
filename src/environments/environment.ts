// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebaseConfig : {
  apiKey: "AIzaSyDGW6qjcoEuSHLoI8DNe7j0Fw2hUVd-XJE",
  authDomain: "atelier-num.firebaseapp.com",
  projectId: "atelier-num",
  storageBucket: "atelier-num.appspot.com",
  messagingSenderId: "38303227782",
  appId: "1:38303227782:web:9ebef995861349fdf75607",
  measurementId: "G-KRH20VXBK9"
}
};

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
