import { useEffect, useState } from 'react';
import { ImageSourcePropType, View } from 'react-native';
// cameraType - acessa a camera da frente
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector'
//useSharedValue - para salvar as posições da face na camera
// criar uma estilização animada que vai fazer uso do valor compartilhado
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated'

//para não dar erro criar uma pasta @types com um arquivo png.d.ts para 'tipar as imagens'
//para que as imagens sejam reconhecidas
import neutralImg from '../assets/neutral.png'
import smilingImg from '../assets/grinning.png'
import winkingImg from '../assets/winking.png'

import { styles } from './styles';

export function Home() {

  const [faceDetected, setFaceDetected] = useState(false)

  //  **Solicitar permissão para usar a camera**
  // a camera irá obter 2 parâmetros:
  //  permission = permissão do usuário (S/N),  
  // requestPermition = função para solicitar a permissão
  const [permission, requestPermission] = Camera.useCameraPermissions()
  //essa vai ser a imagem padrão explicita
  const [emoji, setEmoji] = useState<ImageSourcePropType>(neutralImg)

  //posições da face começando em 0
  const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })

  // Função para detectar a face
  function handleFacesDetected({faces}: FaceDetectionResult){
    // pegar a primeira posição da face
    const face = faces[0] as any

    if(face){
      //Posições da face na camera
      const { size, origin } = face.bounds

      faceValues.value = {
        width: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y
      }

      setFaceDetected(true)
      if(face.smilingProbability > 0.5){
        setEmoji(smilingImg)
      }
      //espelhado
      else if(face.leftEyeOpenProbability > 0.5 && face.rightEyeOpenProbability < 0.5) {
        setEmoji(winkingImg)
      }
      
      else {
        setEmoji(neutralImg)
      }
    }else {
      setFaceDetected(false)
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: 1,
    // pega a posição a profundidade da face
    width: faceValues.value.width,
    height: faceValues.value.height,
    transform: [
      {translateX: faceValues.value.x},
      {translateY: faceValues.value.y},
    ],
    //aparecer a borda para marcar a face(teste)
    // borderColor: 'blue',
    // borderWidth: 10
  }))

  // useEffect - assim que a interface for renderizada
  useEffect(() => {
    // solicitar a permissão
    requestPermission();
  }, [])

  if(!permission?.granted){
    return null;
  }

  return (
    <View style={styles.container}>
      {
        faceDetected &&
        <Animated.Image
         style={animatedStyle} 
         source={emoji}
        />
      }
      <Camera 
      style={styles.camera}
      type={CameraType.front}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 100,
        tracking: true,
      }}/> 
      </View>
  )
}