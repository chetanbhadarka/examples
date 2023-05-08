import React, {Component} from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Icons} from '../assets/assetConstants';

const winHeight = Dimensions.get('screen').height;

export default class CustomReactionButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedButton: 'none',
    };
    if (this.props.defaultVal == 'none') {
      this.whichIconUserChoose = 0;
    } else if (this.props.defaultVal === 'like') {
      this.whichIconUserChoose = 1;
    } else if (this.props.defaultVal === 'celebrate') {
      this.whichIconUserChoose = 2;
    } else if (this.props.defaultVal === 'support') {
      this.whichIconUserChoose = 1;
    } else if (this.props.defaultVal === 'love') {
      this.whichIconUserChoose = 4;
    } else if (this.props.defaultVal === 'insightful') {
      this.whichIconUserChoose = 5;
    } else if (this.props.defaultVal === 'curious') {
      this.whichIconUserChoose = 6;
    }

    // Slow down speed animation here (1 = default)
    this.timeDilation = 1;

    // If duration touch longer than it, mean long touch
    this.durationLongPress = 250;

    this.isTouchBtn = false;

    this.isLongTouch = false;
    this.isLiked = false;
    // this.whichIconUserChoose = 0;
    this.currentIconFocus = 0;
    this.previousIconFocus = 0;
    this.isDragging = false;
    this.isDraggingOutside = false;
    this.isJustDragInside = true;

    // Duration animation
    this.durationAnimationBox = 500;
    this.durationAnimationQuickTouch = 500;
    this.durationAnimationLongTouch = 150;
    this.durationAnimationIconWhenDrag = 150;
    this.durationAnimationIconWhenRelease = 1000;

    // -----------------------------------------
    // Animation button when quick touch button
    this.tiltIconAnim = new Animated.Value(0);
    this.zoomIconAnim = new Animated.Value(0);
    this.zoomTextAnim = new Animated.Value(0);

    // -----------------------------------------
    // Animation when button long touch button
    this.tiltIconAnim2 = new Animated.Value(0);
    this.zoomIconAnim2 = new Animated.Value(0);
    this.zoomTextAnim2 = new Animated.Value(0);
    // Animation of the box
    this.fadeBoxAnim = new Animated.Value(0);

    // Animation for emoticons
    this.moveRightGroupIcon = new Animated.Value(10);
    // Like
    this.pushIconLikeUp = new Animated.Value(0);
    // I don't know why, but when I set to 0.0, it seem blink,
    // so temp solution is set to 0.01
    this.zoomIconLike = new Animated.Value(0.01);
    // Love
    this.pushIconLoveUp = new Animated.Value(0);
    this.zoomIconLove = new Animated.Value(0.01);
    // Haha
    this.pushIconHahaUp = new Animated.Value(0);
    this.zoomIconHaha = new Animated.Value(0.01);
    // Wow
    this.pushIconWowUp = new Animated.Value(0);
    this.zoomIconWow = new Animated.Value(0.01);
    // Sad
    this.pushIconSadUp = new Animated.Value(0);
    this.zoomIconSad = new Animated.Value(0.01);
    // Angry
    this.pushIconAngryUp = new Animated.Value(0);
    this.zoomIconAngry = new Animated.Value(0.01);

    // ------------------------------------------------------
    // Animation for zoom emoticons when drag
    this.zoomIconChosen = new Animated.Value(1);
    this.zoomIconNotChosen = new Animated.Value(1);
    this.zoomIconWhenDragOutside = new Animated.Value(1);
    this.zoomIconWhenDragInside = new Animated.Value(1);
    this.zoomBoxWhenDragInside = new Animated.Value(1);
    this.zoomBoxWhenDragOutside = new Animated.Value(0.95);

    // Animation for text description at top icon
    this.pushTextDescriptionUp = new Animated.Value(60);
    this.zoomTextDescription = new Animated.Value(1);

    // --------------------------------------------------------
    // Animation for jump emoticon when release finger
    this.zoomIconWhenRelease = new Animated.Value(1);
    this.moveUpDownIconWhenRelease = new Animated.Value(0);
    this.moveLeftIconLikeWhenRelease = new Animated.Value(20);
    this.moveLeftIconLoveWhenRelease = new Animated.Value(72);
    this.moveLeftIconHahaWhenRelease = new Animated.Value(124);
    this.moveLeftIconWowWhenRelease = new Animated.Value(173);
    this.moveLeftIconSadWhenRelease = new Animated.Value(226);
    this.moveLeftIconAngryWhenRelease = new Animated.Value(278);
  }

  UNSAFE_componentWillMount() {
    this.setupPanResponder();
  }

  // Handle the drag gesture
  setupPanResponder() {
    this.rootPanResponder = PanResponder.create({
      // prevent if user's dragging without long touch the button
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // !this.isTouchBtn && this.isLongTouch
        return true;
      },

      onPanResponderGrant: (evt, gestureState) => {
        this.handleEmoticonWhenDragging(evt, gestureState);
      },

      onPanResponderMove: (evt, gestureState) => {
        this.handleEmoticonWhenDragging(evt, gestureState);
      },

      onPanResponderRelease: (evt, gestureState) => {
        this.isDragging = false;
        this.isDraggingOutside = false;
        this.isJustDragInside = true;
        this.previousIconFocus = 0;
        this.currentIconFocus = 0;
        this.setState({});

        this.onDragRelease();
        this.props.onButtonSelected(this.getTextBtn());
      },
    });
  }

  handleEmoticonWhenDragging = (evt, gestureState) => {
    // the margin top the box is 100
    // and plus the height of toolbar and the status bar
    // so the range we check is about 150 -> 450
    if (
      gestureState.y0 + gestureState.dy >= 50 &&
      gestureState.y0 + gestureState.dy <= winHeight
    ) {
      this.isDragging = true;
      this.isDraggingOutside = false;

      if (this.isJustDragInside) {
        this.controlIconWhenDragInside();
      }

      if (
        gestureState.x0 + gestureState.dx >= 50 &&
        gestureState.x0 + gestureState.dx < 95
      ) {
        if (this.currentIconFocus !== 1) {
          this.handleWhenDragBetweenIcon(1);
        }
      } else if (
        gestureState.x0 + gestureState.dx >= 95 &&
        gestureState.x0 + gestureState.dx < 140
      ) {
        if (this.currentIconFocus !== 2) {
          this.handleWhenDragBetweenIcon(2);
        }
      } else if (
        gestureState.x0 + gestureState.dx >= 140 &&
        gestureState.x0 + gestureState.dx < 185
      ) {
        if (this.currentIconFocus !== 3) {
          this.handleWhenDragBetweenIcon(3);
        }
      } else if (
        gestureState.x0 + gestureState.dx >= 185 &&
        gestureState.x0 + gestureState.dx < 230
      ) {
        if (this.currentIconFocus !== 4) {
          this.handleWhenDragBetweenIcon(4);
        }
      } else if (
        gestureState.x0 + gestureState.dx >= 230 &&
        gestureState.x0 + gestureState.dx < 275
      ) {
        if (this.currentIconFocus !== 5) {
          this.handleWhenDragBetweenIcon(5);
        }
      } else if (
        gestureState.x0 + gestureState.dx >= 275 &&
        gestureState.x0 + gestureState.dx <= 320
      ) {
        if (this.currentIconFocus !== 6) {
          this.handleWhenDragBetweenIcon(6);
        }
      }
    } else {
      this.whichIconUserChoose = 0;
      this.previousIconFocus = 0;
      this.currentIconFocus = 0;
      this.isJustDragInside = true;

      if (this.isDragging && !this.isDraggingOutside) {
        this.isDragging = false;
        this.isDraggingOutside = true;
        this.setState({});

        this.controlBoxWhenDragOutside();
        this.controlIconWhenDragOutside();
      }
    }
  };

  // Handle Press on btn
  onPressBtn = () => {
    this.isTouchBtn = true;
    this.setState({});

    if (!this.isLongTouch) {
      if (this.whichIconUserChoose !== 0) {
        this.whichIconUserChoose = 0;

        // assuming that another emoticon is the same like, so we can animate the reverse then
        this.isLiked = true;
      }
      this.doAnimationQuickTouch();
      this.props.onButtonSelected('like');
    }
  };
  onLongPressBtn = () => {
    this.isTouchBtn = false;
    this.setState({});
    this.doAnimationLongTouch();
  };

  onDragRelease = () => {
    // To lower the emoticons
    this.doAnimationLongTouchReverse();

    // To jump particular emoticon be chosen
    this.controlIconWhenRelease();
  };

  // Animation button when quick touch button
  doAnimationQuickTouch = () => {
    if (!this.isLiked) {
      this.isLiked = true;
      this.setState({});

      this.tiltIconAnim.setValue(0);
      this.zoomIconAnim.setValue(0);
      this.zoomTextAnim.setValue(0);
      Animated.parallel([
        Animated.timing(this.tiltIconAnim, {
          toValue: 1,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: true,
        }),
        Animated.timing(this.zoomIconAnim, {
          toValue: 1,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: true,
        }),
        Animated.timing(this.zoomTextAnim, {
          toValue: 1,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      this.isLiked = false;
      this.setState({});

      this.tiltIconAnim.setValue(1);
      this.zoomIconAnim.setValue(1);
      this.zoomTextAnim.setValue(1);
      Animated.parallel([
        Animated.timing(this.tiltIconAnim, {
          toValue: 0,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: true,
        }),
        Animated.timing(this.zoomIconAnim, {
          toValue: 0,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: true,
        }),
        Animated.timing(this.zoomTextAnim, {
          toValue: 0,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Animation when long touch button
  doAnimationLongTouch = () => {
    this.isLongTouch = true;
    this.setState({});

    this.tiltIconAnim2.setValue(0);
    this.zoomIconAnim2.setValue(1);
    this.zoomTextAnim2.setValue(1);

    this.fadeBoxAnim.setValue(0);

    this.moveRightGroupIcon.setValue(10);

    this.pushIconLikeUp.setValue(0);
    this.zoomIconLike.setValue(0.01);

    this.pushIconLoveUp.setValue(0);
    this.zoomIconLove.setValue(0.01);

    this.pushIconHahaUp.setValue(0);
    this.zoomIconHaha.setValue(0.01);

    this.pushIconWowUp.setValue(0);
    this.zoomIconWow.setValue(0.01);

    this.pushIconSadUp.setValue(0);
    this.zoomIconSad.setValue(0.01);

    this.pushIconAngryUp.setValue(0);
    this.zoomIconAngry.setValue(0.01);

    Animated.parallel([
      // Button
      Animated.timing(this.tiltIconAnim2, {
        toValue: 1,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomIconAnim2, {
        toValue: 0.8,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomTextAnim2, {
        toValue: 0.8,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: true,
      }),

      // Box
      Animated.timing(this.fadeBoxAnim, {
        toValue: 1,
        duration: 300,
        delay: 10,
        useNativeDriver: true,
      }),

      // Group emoticon
      Animated.timing(this.moveRightGroupIcon, {
        toValue: 20,
        duration: this.durationAnimationBox * this.timeDilation,
        useNativeDriver: true,
      }),

      Animated.timing(this.pushIconLikeUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomIconLike, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
      }),

      Animated.timing(this.pushIconLoveUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 50,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomIconLove, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 50,
        useNativeDriver: true,
      }),

      Animated.timing(this.pushIconHahaUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomIconHaha, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 100,
        useNativeDriver: true,
      }),

      Animated.timing(this.pushIconWowUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomIconWow, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 150,
        useNativeDriver: true,
      }),

      Animated.timing(this.pushIconSadUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomIconSad, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 200,
        useNativeDriver: true,
      }),

      Animated.timing(this.pushIconAngryUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomIconAngry, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  doAnimationLongTouchReverse = () => {
    this.tiltIconAnim2.setValue(1);
    this.zoomIconAnim2.setValue(0.8);
    this.zoomTextAnim2.setValue(0.8);

    this.fadeBoxAnim.setValue(1);

    this.moveRightGroupIcon.setValue(20);

    this.pushIconLikeUp.setValue(25);
    this.zoomIconLike.setValue(1);

    this.pushIconLoveUp.setValue(25);
    this.zoomIconLove.setValue(1);

    this.pushIconHahaUp.setValue(25);
    this.zoomIconHaha.setValue(1);

    this.pushIconWowUp.setValue(25);
    this.zoomIconWow.setValue(1);

    this.pushIconSadUp.setValue(25);
    this.zoomIconSad.setValue(1);

    this.pushIconAngryUp.setValue(25);
    this.zoomIconAngry.setValue(1);

    Animated.parallel([
      // Button
      Animated.timing(this.tiltIconAnim2, {
        toValue: 0,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomIconAnim2, {
        toValue: 1,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomTextAnim2, {
        toValue: 1,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: true,
      }),

      // Box
      Animated.timing(this.fadeBoxAnim, {
        toValue: 0,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: true,
      }),

      // Group emoticon
      Animated.timing(this.moveRightGroupIcon, {
        toValue: 10,
        duration: this.durationAnimationBox * this.timeDilation,
        useNativeDriver: true,
      }),

      Animated.timing(this.pushIconLikeUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.zoomIconLike, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
      }),

      Animated.timing(this.pushIconLoveUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 50,
      }),
      Animated.timing(this.zoomIconLove, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 50,
      }),

      Animated.timing(this.pushIconHahaUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 100,
      }),
      Animated.timing(this.zoomIconHaha, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 100,
      }),

      Animated.timing(this.pushIconWowUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 150,
      }),
      Animated.timing(this.zoomIconWow, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 150,
      }),

      Animated.timing(this.pushIconSadUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 200,
      }),
      Animated.timing(this.zoomIconSad, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 200,
      }),

      Animated.timing(this.pushIconAngryUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 250,
      }),
      Animated.timing(this.zoomIconAngry, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        useNativeDriver: true,
        delay: 250,
      }),
    ]).start(this.onAnimationLongTouchComplete);
  };

  onAnimationLongTouchComplete = () => {
    this.isLongTouch = false;
    this.setState({});
  };

  // Animation for zoom emoticons when drag
  handleWhenDragBetweenIcon = currentIcon => {
    this.whichIconUserChoose = currentIcon;
    this.previousIconFocus = this.currentIconFocus;
    this.currentIconFocus = currentIcon;

    // this.soundIconFocus.play();

    this.controlIconWhenDrag();
  };

  controlIconWhenDrag = () => {
    this.zoomIconChosen.setValue(0.1);
    this.zoomIconNotChosen.setValue(1.8);
    this.zoomBoxWhenDragInside.setValue(1.0);

    this.pushTextDescriptionUp.setValue(10);
    this.zoomTextDescription.setValue(1.0);

    // For update logic at render function
    this.setState({});

    // Need timeout so logic check at render function can update
    setTimeout(
      () =>
        Animated.parallel([
          Animated.timing(this.zoomIconChosen, {
            toValue: 1.2,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: true,
          }),
          Animated.timing(this.zoomIconNotChosen, {
            toValue: 0.8,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: true,
          }),
          Animated.timing(this.zoomBoxWhenDragInside, {
            toValue: 0.95,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: true,
          }),

          Animated.timing(this.pushTextDescriptionUp, {
            toValue: 60,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: true,
          }),
          Animated.timing(this.zoomTextDescription, {
            toValue: 1.7,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: true,
          }),
        ]).start(),
      50,
    );
  };

  controlIconWhenDragInside = () => {
    this.setState({});

    this.zoomIconWhenDragInside.setValue(1.0);
    Animated.timing(this.zoomIconWhenDragInside, {
      toValue: 0.8,
      duration: this.durationAnimationIconWhenDrag * this.timeDilation,
      useNativeDriver: true,
    }).start(this.onAnimationIconWhenDragInsideComplete);
  };

  onAnimationIconWhenDragInsideComplete = () => {
    this.isJustDragInside = false;
    this.setState({});
  };

  controlIconWhenDragOutside = () => {
    this.zoomIconWhenDragOutside.setValue(0.8);

    Animated.timing(this.zoomIconWhenDragOutside, {
      toValue: 1.0,
      duration: this.durationAnimationIconWhenDrag * this.timeDilation,
      useNativeDriver: true,
    }).start();
  };

  controlBoxWhenDragOutside = () => {
    this.zoomBoxWhenDragOutside.setValue(0.95);

    Animated.timing(this.zoomBoxWhenDragOutside, {
      toValue: 1.0,
      duration: this.durationAnimationIconWhenDrag * this.timeDilation,
      useNativeDriver: true,
    }).start();
  };

  // Animation for jump emoticon when release finger0.01
  controlIconWhenRelease = () => {
    this.zoomIconWhenRelease.setValue(1);
    this.moveUpDownIconWhenRelease.setValue(0);
    this.moveLeftIconLikeWhenRelease.setValue(20);
    this.moveLeftIconLoveWhenRelease.setValue(72);
    this.moveLeftIconHahaWhenRelease.setValue(154);
    this.moveLeftIconWowWhenRelease.setValue(173);
    this.moveLeftIconSadWhenRelease.setValue(226);
    this.moveLeftIconAngryWhenRelease.setValue(278);

    Animated.parallel([
      Animated.timing(this.zoomIconWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.moveUpDownIconWhenRelease, {
        toValue: 1,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.moveLeftIconLikeWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.moveLeftIconLoveWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.moveLeftIconHahaWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.moveLeftIconWowWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.moveLeftIconSadWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: true,
      }),
      Animated.timing(this.moveLeftIconAngryWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: true,
      }),
    ]).start();
  };

  render() {
    return (
      <View
        style={{
          flex: 1 / 3,
          justifyContent: 'flex-end',
          margin: 20,
        }}>
        {this.isLongTouch ? this.renderGroupIcon() : null}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => this.onPressBtn()}
          onLongPress={() => this.onLongPressBtn()}>
          <Image
            source={this.getIconBtn()}
            style={styles.imgLikeInBtn}
            resizeMode="contain"
          />
          <Text style={this.props.textStyle}>{this.getTextBtn()}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  getIconBtn() {
    if (!this.isLongTouch && this.isLiked) {
      return Icons.like;
    } else if (!this.isDragging) {
      switch (this.whichIconUserChoose) {
        case 1:
          return Icons.like;
        case 2:
          return Icons.celebrate;
        case 3:
          return Icons.support;
        case 4:
          return Icons.love;
        case 5:
          return Icons.insightful;
        case 6:
          return Icons.curious;
        default:
          return Icons.likeOutline;
      }
    } else {
      return Icons.likeOutline;
    }
  }

  getTextBtn() {
    if (this.isDragging) {
      return 'Like';
    }
    switch (this.whichIconUserChoose) {
      case 1:
        return 'Like';
      case 2:
        return 'Celebrate';
      case 3:
        return 'Support';
      case 4:
        return 'Love';
      case 5:
        return 'Insightful';
      case 6:
        return 'Curious';
      default:
        return 'Like';
    }
  }

  onIconPress(idnex) {
    this.isDragging = false;
    this.isDraggingOutside = false;
    this.whichIconUserChoose = idnex;
    this.onDragRelease();
    this.previousIconFocus = 0;
    this.currentIconFocus = 0;

    this.props.onButtonSelected(this.getTextBtn());
  }

  renderGroupIcon() {
    return (
      <Animated.View
        style={styles.viewWrapGroupIcon}
        {...this.rootPanResponder.panHandlers}>
        {/* Icon Like */}
        <View style={styles.viewWrapIcon}>
          {this.currentIconFocus === 1 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  translateY: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                  minWidth: 28,
                },
              ]}>
              <Text style={styles.textDescription}>Like</Text>
            </Animated.View>
          ) : null}
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 1
                      ? this.zoomIconChosen
                      : this.previousIconFocus === 1
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconLike,
                },
              ],
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.onIconPress(1)}>
              <Image
                style={styles.imgIcon}
                source={Icons.like}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Icon Celebrate */}
        <View style={styles.viewWrapIcon}>
          {this.currentIconFocus === 2 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  translateY: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                  minWidth: 46,
                },
              ]}>
              <Text style={styles.textDescription}>Celebrate</Text>
            </Animated.View>
          ) : null}
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 2
                      ? this.zoomIconChosen
                      : this.previousIconFocus === 2
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconLove,
                },
              ],
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.onIconPress(2)}>
              <Image
                style={styles.imgIcon}
                source={Icons.celebrate}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Icon Support */}
        <View style={styles.viewWrapIcon}>
          {this.currentIconFocus === 3 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  translateY: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                  minWidth: 40,
                },
              ]}>
              <Text style={styles.textDescription}>Support</Text>
            </Animated.View>
          ) : null}
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 3
                      ? this.zoomIconChosen
                      : this.previousIconFocus === 3
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconHaha,
                },
              ],
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.onIconPress(3)}>
              <Image
                style={styles.imgIcon}
                source={Icons.support}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Icon Love */}
        <View style={styles.viewWrapIcon}>
          {this.currentIconFocus === 4 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  translateY: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                  minWidth: 28,
                },
              ]}>
              <Text style={styles.textDescription}>Love</Text>
            </Animated.View>
          ) : null}
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 4
                      ? this.zoomIconChosen
                      : this.previousIconFocus === 4
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconWow,
                },
              ],
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.onIconPress(4)}>
              <Image
                style={styles.imgIcon}
                source={Icons.love}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Icon Insightful */}
        <View style={styles.viewWrapIcon}>
          {this.currentIconFocus === 5 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  translateY: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                  minWidth: 44,
                },
              ]}>
              <Text style={styles.textDescription}>Insightful</Text>
            </Animated.View>
          ) : null}
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 5
                      ? this.zoomIconChosen
                      : this.previousIconFocus === 5
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconSad,
                },
              ],
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.onIconPress(5)}>
              <Image
                style={styles.imgIcon}
                source={Icons.insightful}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Icon Curious */}
        <View style={styles.viewWrapIcon}>
          {this.currentIconFocus === 6 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  translateY: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                  minWidth: 38,
                },
              ]}>
              <Text style={styles.textDescription}>Curious</Text>
            </Animated.View>
          ) : null}
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 6
                      ? this.zoomIconChosen
                      : this.previousIconFocus === 6
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconAngry,
                },
              ],
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.onIconPress(6)}>
              <Image
                style={styles.imgIcon}
                source={Icons.curious}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  // Button like
  viewBtn: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
    backgroundColor: '#FFF',
  },
  imgLikeInBtn: {
    width: 22,
    height: 20,
  },

  // Group icon
  viewWrapGroupIcon: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    left: 24,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#DFDFDF',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowColor: '#4D4E6D',
    shadowOffset: {height: 0, width: 0},
    elevation: 4,
  },
  viewWrapIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  imgIcon: {
    width: 30,
    height: 30,
  },
  viewWrapTextDescription: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 1,
    paddingVertical: 2,
    position: 'absolute',
  },
  textDescription: {
    color: '#DFDFDF',
    fontSize: 8,
    fontFamily: 'roboto',
    opacity: 1,
    letterSpacing: 0.25,
  },
});
