document.addEventListener("DOMContentLoaded", function () {
  const fileUploadContainer = document.createElement("div");
  fileUploadContainer.className = "file-upload-container";
  fileUploadContainer.innerHTML = `
    Drag and drop a file here or click to upload
    <input type="file" style="display: none;">
  `;

  const fileInput = fileUploadContainer.querySelector("input[type='file']");
  const fileUploadBox = fileUploadContainer;

  fileUploadBox.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    console.log("File selected:", file);

    fileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/upload/upload.gif" alt="Uploading" width="50" height="50">`;

    const formData = new FormData();
    formData.append("file", file);

    fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Upload failed: " + response.statusText);
        }
      })
      .then((result) => {
        fileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt="Done" width="50" height="50">`;
        console.log("File uploaded:", result.data.url);

        // 将上传的文件URL返回到Voiceflow
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: {
            file: result.data.url.replace(
              'https://tmpfiles.org/',
              'https://tmpfiles.org/dl/'
            ),
          },
        });

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
        console.error(error);
        fileUploadContainer.innerHTML = `<div>Error during upload</div>`;
      });
  });

  document.getElementById("file-upload").appendChild(fileUploadContainer);
});
