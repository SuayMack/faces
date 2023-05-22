import { useEffect, useState } from 'react';
import { View } from 'react-native';
// cameraType - acessa a camera da frente
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector'
//para salvar as posições da face na camera
import { useSharedValue } from 'react-native-reanimated'

import { styles } from './style';

export function Home() {

  const [faceDetected, setFaceDetected] = useState(false)

  //  **Solicitar permissão para usar a camera**
  // a camera irá obter 2 parâmetros:
  //  permission = permissão do usuário (S/N),  
  // requestPermition = função para solicitar a permissão
  const [permission, requestPermission] = Camera.useCameraPermissions()

  //posições da face começando em 0
  const faceValues = useSharedValue({
    with: 0,
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
        with: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y
      }

      setFaceDetected(true)
    }else {
      setFaceDetected(false)
    }
  }

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
      }}>        
      </Camera>
    </View>
  )
}