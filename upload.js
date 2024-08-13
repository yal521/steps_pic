.then((result) => {
  fileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt="Done" width="50" height="50">`;
  console.log("File uploaded:", result.data.url);

  // 检查 Voiceflow 对象是否存在
  if (window.voiceflow && window.voiceflow.chat) {
    window.voiceflow.chat.interact({
      type: 'complete',
      payload: {
        file: result.data.url.replace(
          'https://tmpfiles.org/',
          'https://tmpfiles.org/dl/'
        ),
      },
    });
  } else {
    console.error('Voiceflow chat is not available.');
  }

  // 显示上传的图片
  const uploadedImageContainer = document.getElementById('uploaded-image-container');
  const img = document.createElement('img');
  img.src = result.data.url.replace(
    'https://tmpfiles.org/',
    'https://tmpfiles.org/dl/'
  );
  img.alt = "Uploaded Image";
  img.className = "uploaded-image";
  uploadedImageContainer.innerHTML = ''; // 清空之前的图片
  uploadedImageContainer.appendChild(img);

})
.catch((error) => {
  console.error('Upload failed:', error);
  fileUploadContainer.innerHTML = `<div>Error during upload: ${error.message}</div>`;
});
