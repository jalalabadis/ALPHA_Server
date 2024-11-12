const Creatomate = require('creatomate'); 
const dotenv = require('dotenv');
const firebaseUpload = require('./firebaseUpload');
dotenv.config();

const client = new Creatomate.Client(process.env.CM_API);

const createVideo =async (options) => {
    try {
const backgroundElement = options.source.elements.find(element => element.name === "Background");
if (backgroundElement && backgroundElement.text.includes("http://localhost:4000")) {
    backgroundElement.source = await firebaseUpload(`${backgroundElement.text.replace('http://localhost:4000/', '')}`);
} else {
  backgroundElement.source = backgroundElement.text;
    console.log("Background element not found or no matching URL");
}
      

const response = await client.render(options);
  
if (response.length > 0 && response[0].outputFormat === 'mp4') {
       
//console.log(response)
 return response;
        
      } else {
        return null;
      }
    } catch (error) {
      console.log(error)
      return null;
    }
  
  };
  
    module.exports = createVideo