document.addEventListener('click', function(event) {
  if (event.target.tagName === 'A') {
    const url = event.target.href;
    event.preventDefault(); // Ngăn trình duyệt tự động điều hướng

    // Xóa các ký tự từ ký tự "?" trong URL
    const cleanedUrl = url.split('?')[0];
    
    // Gọi hàm unshortenURL với URL đã làm sạch và xử lý kết quả
    unshortenURL(cleanedUrl)
      .then(finalURL => {
        if (confirm(`Final destination: ${finalURL}\n\nDo you want to continue?`)) {
          window.open(url, '_blank');
        }
      })
      .catch(error => {
        console.error('Error unshortening the URL:', error);
        alert('Failed to unshorten the URL. Please try again.');
      });
  }
});

function unshortenURL(url) {
  const apiUrl = `https://unshorten.me/api/v2/unshorten?url=${encodeURIComponent(url)}`;
  const headers = {
    Authorization: "Token d61fd4d643798c5fcb2c2a410a5eadb5f25fcb53"
  };

  return fetch(apiUrl, {
    headers: headers
  })
    .then(response => response.json())
    .then(data => {
      // Hiển thị dữ liệu phản hồi từ API
      console.log('Unshortened URL:', data);
      // Đảm bảo hiển thị kết quả trong console
      return data.unshortened_url; // Trả về URL đã giải mã
    });
}
