import { Navigation } from "react-native-navigation";
import Login from "./src/screens/Login";
import Feed from "./src/components/Feed"
  Navigation.registerComponent(`Login`, () => Login);
  Navigation.registerComponent(`Feed`, () => Feed);

  // Navigation.startSingleScreenApp({
  //   screen: {
  //     screen: 'Login',
  //     title: 'Login',
  //   }
  // });
  Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: "Login",
            options: {
              topBar: {
                visible: false,
              }
            }
          }, 
        }], 
      }
    }
  });
});
