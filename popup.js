document.getElementById('analyzeButton').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value.trim();
  
  if (isValidURL(url)) {
    const decodedUrl = decodeURIComponent(url);
    const cleanedUrl = cleanURL(decodedUrl); // Làm sạch URL

    document.getElementById('decodedUrl').textContent = `Decoded URL: ${cleanedUrl}`; // Hiển thị URL đã giải mã
    analyzeURL(cleanedUrl);
  } else {
    document.getElementById('decodedUrl').textContent = ''; // Xóa nếu URL không hợp lệ
    document.getElementById('result').textContent = 'Invalid URL';
    document.getElementById('apiResult').textContent = '';
    document.getElementById('apiDetails').textContent = '';
  }
});

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function cleanURL(url) {
  let cleanedUrl = url;
  
  // Loại bỏ phần "https://l.facebook.com/l.php?u="
  if (cleanedUrl.startsWith("https://l.facebook.com/l.php?u=")) {
    cleanedUrl = cleanedUrl.substring("https://l.facebook.com/l.php?u=".length);
  }
  
  // Loại bỏ phần đằng sau dấu "?"
  const index = cleanedUrl.indexOf("?");
  if (index !== -1) {
    cleanedUrl = cleanedUrl.substring(0, index);
  }

  return cleanedUrl;
}

function analyzeURL(url) {
  fetch(url, { method: 'HEAD' })
    .then(response => {
      let finalUrl = response.url;
      
      // Loại bỏ các ký tự sau dấu '?'
      const index = finalUrl.indexOf("?");
      if (index !== -1) {
        finalUrl = finalUrl.substring(0, index);
      }

      document.getElementById('result').textContent = `Final destination: ${finalUrl}`;
    })
    .catch(error => {
      console.error('Error fetching the URL:', error);
      document.getElementById('result').textContent = 'Failed to fetch the URL. Please try again.';
    });

  // Gọi API unshorten.me với URL đã giải mã và làm sạch
  unshortenURL(url);
}

function unshortenURL(url) {
  const apiUrl = `https://unshorten.me/api/v2/unshorten?url=${encodeURIComponent(url)}`;
  const headers = {
    Authorization: "Token d61fd4d643798c5fcb2c2a410a5eadb5f25fcb53"
  };

  fetch(apiUrl, {
    headers: headers
  })
    .then(response => response.json())
    .then(data => {
      // Hiển thị dữ liệu phản hồi từ API
      console.log('Unshortened URL:', data);
      document.getElementById('apiResult').innerHTML = `<a href="#" id="unshortenedUrlLink">Unshortened URL: ${data.unshortened_url}</a>`;
      document.getElementById('apiDetails').innerHTML = `
        <p>Shortened URL: ${data.shortened_url}</p>
        <p>Success: ${data.success}</p>
      `;
      
      // Thêm sự kiện click để hiển thị popup với URL đích
      document.getElementById('unshortenedUrlLink').addEventListener('click', (e) => {
        e.preventDefault();
        let unshortenedUrl = data.unshortened_url;

        // Loại bỏ các ký tự sau dấu '?'
        const index = unshortenedUrl.indexOf("?");
        if (index !== -1) {
          unshortenedUrl = unshortenedUrl.substring(0, index);
        }

        const confirmed = confirm(`Final destination: ${unshortenedUrl}\n\nDo you want to continue?`);
        if (confirmed) {
          window.open(unshortenedUrl, '_blank');
        }
      });
    })
    .catch(error => {
      console.error('Error unshortening the URL:', error);
      document.getElementById('apiResult').textContent = 'Failed to unshorten the URL. Please try again.';
      document.getElementById('apiDetails').textContent = '';
    });
}




