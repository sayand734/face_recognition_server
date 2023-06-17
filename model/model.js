const fs = require('fs');
const faceapi = require('face-api.js');
const tf = require('@tensorflow/tfjs-node')


async function getLabeledDescriptors() {
    const directoryPath = './images';
    const labels = fs.readdirSync(directoryPath);
  
    const promises = labels.map(async (label) => {
      const descriptions = [];
      const path = `${directoryPath}/${label}/`;
      const images = fs.readdirSync(path);
  
      for (const image of images) {
        const saved_image = fs.readFileSync(`${path}${image}`);
        const saved_tensor = tf.node.decodeImage(saved_image);
        const saved_image_face = await faceapi.detectSingleFace(saved_tensor).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(saved_image_face.descriptor);
      }
      
      return Promise.resolve(new faceapi.LabeledFaceDescriptors(label, descriptions));
    });
  
    return Promise.all(promises);
  }
  
      
    
  
  
  
  
  
  
  export function processImage(imageFile) {
    fs.readFile(imageFile.path, (quary_error,quary_image) => {
      const quary_tensor = tf.node.decodeImage(quary_image)
        faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models/').then(()=>{
          faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models/').then(()=>{
            faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models/').then(()=>{
                faceapi.detectSingleFace(quary_tensor).withFaceLandmarks().withFaceDescriptor().then((quary_image_face)=>{
                  return getLabeledDescriptors().then((labeledDescriptors)=>{
                    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
                    const bestMatch = faceMatcher.findBestMatch(quary_image_face.descriptor);
                    console.log(bestMatch.toString());
                  })
                })
            })
          })
      });
   
  
      if (quary_error) {
          console.error(quary_error);
          return res.status(500).send('Error reading the file');
        }  
    })
  }


