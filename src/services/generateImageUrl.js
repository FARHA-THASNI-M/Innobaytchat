export const generateImageUrl = (file) => {
  var image = file?.data;

  var imageBuffer = new ArrayBuffer(image.length);

  var res = new Uint8Array(imageBuffer);

  for (var i = 0; i < image.length; ++i) {
    res[i] = image[i];
  }

  var imagedownload = document.createElement("a");

  document.body.appendChild(imagedownload);

  imagedownload.style = "display: none";

  const imageblob = new Blob([imageBuffer], { type: "image/*" });

  var imagebloburl = URL.createObjectURL(imageblob);

  imagedownload.href = imagebloburl;

  return imagebloburl.toString();
};
