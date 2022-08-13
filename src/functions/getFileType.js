export default function getFileType(url) {
    const type = url.split(/[#?]/)[0].split('.').pop().trim();
 
 if(type === "png" || type ===  "jpg" || type ===  "gif" || type === "webp" || type === "svg") {
 return "image"
 
 } else {
 return "video"
 }
 }