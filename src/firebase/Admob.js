  import admob, {
  MaxAdContentRating,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  BannerAd,
  TestIds,
  BannerAdSize,
  AdMobRewarded,
} from '@react-native-firebase/admob';
export const showInterstitialAd = () => {
    // Create a new instance
    console.log('showInterstitialAd');
    const interstitialAd = InterstitialAd.createForAdRequest('ca-app-pub-5057240456793980/6539388422');

    // Add event handlers
    interstitialAd.onAdEvent((type, error) => {
        if (type === AdEventType.LOADED) {
            interstitialAd.show();
        }
    });

    // Load a new advert
    interstitialAd.load();
}