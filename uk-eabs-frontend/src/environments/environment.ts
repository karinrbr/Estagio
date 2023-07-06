// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'dave-scott-signs',
    appId: '1:527332911156:web:3f0f92481ed94ce54e0261',
    storageBucket: 'dave-scott-signs.appspot.com',
    apiKey: 'AIzaSyD8rHsxT7wM3Qv5SpXQh_YuCUoNfY5FPSM',
    authDomain: 'dave-scott-signs.firebaseapp.com',
    messagingSenderId: '527332911156',
    measurementId: 'G-FHJGL34VMZ',
  },
  production: false,
  backendUrl: `http://localhost:8190/api`,
  firebaseConfig: {
    apiKey: "AIzaSyD8rHsxT7wM3Qv5SpXQh_YuCUoNfY5FPSM",
    authDomain: "dave-scott-signs.firebaseapp.com",
    projectId: "dave-scott-signs",
    storageBucket: "dave-scott-signs.appspot.com",
    messagingSenderId: "527332911156",
    appId: "1:527332911156:web:3f0f92481ed94ce54e0261",
    measurementId: "G-FHJGL34VMZ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
