<script>
  // 从本地存储获取背景信息
  const getBackgroundInfo = () => {
    try {
      return JSON.parse(localStorage.getItem("bg-info")) || {};
    } catch {
      return {};
    }
  };

  // 更新背景图片
  const updateBackgroundImage = (url) => {
    document.documentElement.style.setProperty(
      "--custom-background-image",
      `url('${url}')`
    );
  };

  // 判断是否需要请求新图片
  const shouldRequestNewImage = (bgInfo) => {
    const today = new Date().getDate();
    const isDarkMode = document.documentElement.classList.contains("dark");
    return isDarkMode && (!bgInfo.day || bgInfo.day !== today);
  };

  // 设置背景图片
  const setBackground = async () => {
    const bgInfo = getBackgroundInfo();

    if (!shouldRequestNewImage(bgInfo)) {
      if (bgInfo.url) updateBackgroundImage(bgInfo.url);
      return;
    }

    const apiUrl =
      "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN";
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.images?.length > 0) {
        const imageUrl = `https://cn.bing.com${result.images[0].url}`;
        const base64Url = await convertImageToBase64(imageUrl);

        const newBgInfo = {
          day: new Date().getDate(),
          url: base64Url,
        };
        localStorage.setItem("bg-info", JSON.stringify(newBgInfo));
        updateBackgroundImage(base64Url);
      }
    } catch (error) {
      console.error("背景图片加载失败，使用默认背景", error);
      const fallbackUrl = "path/to/default-image.jpg"; // 默认背景图片路径
      updateBackgroundImage(fallbackUrl);
    }
  };

  // 将图片转换为 Base64
  const convertImageToBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
        canvas.remove();
      };

      img.onerror = reject;
    });

  // 执行背景设置
  setBackground();
</script>