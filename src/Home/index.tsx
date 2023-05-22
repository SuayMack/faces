import { View } from 'react-native';
// cameraType - acessa a camera da frente
import { Camera, CameraType } from 'expo-camera';

import { styles } from './style';
import { useEffect } from 'react';

export function Home() {

  //  **Solicitar permissão para usar a camera**
  // a camera irá obter 2 parâmetros:
  //  permission = permissão do usuário (S/N),  
  // requestPermition = função para solicitar a permissão
  const [permission, requestPermission] = Camera.useCameraPermissions()

  // useEffect - assim que a interface for renderizada
  useEffect(() => {
    // solicitar a permissão
    requestPermission();
  }, []);

  if(!permission?.granted){
    return null;
  }

  return (
    <View style={styles.container}>
      <Camera 
      style={styles.camera}
      type={CameraType.front}>        
      </Camera>
    </View>
  );
}