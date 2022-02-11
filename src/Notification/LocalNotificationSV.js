import PushNotification from 'react-native-push-notification';

class LocalNotificationSV {
  showNotification = (title, message, pictureUrl) => {
    PushNotification.localNotification({
      channelId: "channel-id",
      title: title || '',
      message: message || '', // (required)
      bigPictureUrl: pictureUrl || '',
    });
  };
  configure = () => {
    PushNotification.configure({
      onRegister: function (token) {
        // console.log('[LocalNotificationService] onRegister:', token);
      },
      onNotification: function (notification) {
        // console.log('[LocalNotificationService] onNotification:', notification);
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };
  createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'channel-id', // (required)
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default',
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) See `soundName` parameter of `localNotification` function
      },
      created => 
      {
      // console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      }
    );
  };
}

export const localNotificationSV = new LocalNotificationSV();