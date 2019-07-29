/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import SmsListener from 'react-native-android-sms-listener';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      code: '', 
      sender: '',
      waitedCode: '123456',
      status: 'En attente d\'un SMS...'
    };
    this.subscription = {};
  }

  async componentDidMount() {
    let granted = await this.requestReadSmsPermission();
    if (granted) {
      this.subscribeSMSListener();
    }
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  subscribeSMSListener() {
    this.subscription = SmsListener.addListener(message => {
      let verificationCodeRegex = /[a-zA-Z0-9éàèêçëù_ .,:-]{0,}([\d]{6})[a-zA-Z0-9éàèêçëù_ .,:-]{0,}/;
     
      if (verificationCodeRegex.test(message.body)) {
        let verificationCode = message.body.match(verificationCodeRegex)[1];
        let stat = {
          code: verificationCode, 
          sender: message.originatingAddress,
          waitedCode: '123456',
          status: 'En attente d\'un SMS...'
        };
        if (verificationCode === stat.waitedCode) {
          stat.status = 'Vous avez entré le code attendu. En attente d\'un SMS...';
        } else {
          stat.status = 'Vous avez entré un code érroné. En attente d\'un SMS...';
        }

        this.setState(stat);
      }
    });
  }

  async requestReadSmsPermission() {
    try {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "Auto Verification OTP",
          message: "need access to read sms, to verify OTP"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: "Receive SMS",
            message: "Need access to receive sms, to verify OTP"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          // console.log("RECEIVE_SMS permissions denied");
        }
      } else {
        // console.log("sms read permissions denied");
      }
    } catch (err) {
      // console.log(err);
    }
    return false;
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Test</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Code Attendu : {this.state.waitedCode}
                </Text>
                <Text style={styles.sectionDescription}>
                  Code Reçu : {this.state.code}
                </Text>
                <Text style={styles.sectionDescription}>
                  Expediteur : {this.state.sender}
                </Text>
                <Text style={styles.sectionDescription}>
                  Statut : {this.state.status}
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
