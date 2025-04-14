    document.addEventListener(&quot;DOMContentLoaded&quot;, function () {
        const imageUrls = [
            &quot;https://s0.2mdn.net/simgad/11548484513435043759&quot;,
            &quot;https://tpc.googlesyndication.com/simgad/3788305553158364825&quot;,
            &quot;https://tpc.googlesyndication.com/simgad/16888552903276282089&quot;,
            &quot;https://i.imgur.com/i2vdQ5X.jpeg&quot;
        ];

        const adClickUrl = &quot;https://stenexeb.xyz/4/9114105&quot;;

        if (sessionStorage.getItem(&#39;popupHandled&#39;)) {
            //console.log(&quot;Popup already handled in this session. Not showing again.&quot;);
            return;
        }

        const overlay = document.createElement(&quot;div&quot;);
        overlay.id = &quot;overlay&quot;;
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.5); z-index: 999;
            display: none; pointer-events: none;
        `;

        const popup = document.createElement(&quot;div&quot;);
        popup.id = &quot;popup&quot;;
        popup.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0.8); opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            width: 300px; height: 250px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border-radius: 15px; z-index: 1000; overflow: hidden;
            background: white; display: none;
        `;

        popup.innerHTML = `
            <style>
                #closeBtn {
                    position: absolute; top: 5px; right: 5px; background: red; color: white;
                    border: none; padding: 5px 10px; cursor: pointer; font-size: 16px;
                    border-radius: 5px; z-index: 1002;
                    transition: all 0.2s ease;
                }
                #closeBtn:hover { background: #ff4444 !important; transform: scale(1.1); }
                .loader {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    border: 4px solid #f3f3f3; border-top: 4px solid #3498db;
                    border-radius: 50%; width: 30px; height: 30px;
                    animation: spin 1s linear infinite;
                    z-index: 1;
                    display: block;
                }
                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                #ad-container {
                    width: 100%; height: 100%; position: relative;
                    background: white;
                }
                #popupAdLink {
                    display: none;
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    text-decoration: none;
                    cursor: pointer;
                    z-index: 2;
                }
                 #popupAdImage {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    vertical-align: top;
                }
            </style>
            <button id='closeBtn'>X</button>
            <div id='ad-container'>
                <div class='loader'/>
                <a href='${adClickUrl}' id='popupAdLink' rel='noopener noreferrer' target='_blank'>
                    <img alt='Advertisement' id='popupAdImage' src=''/>
                </a>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        const adLinkElement = popup.querySelector(&#39;#popupAdLink&#39;);
        const adImageElement = popup.querySelector(&#39;#popupAdImage&#39;);
        const loader = popup.querySelector(&#39;.loader&#39;);
        const closeButton = popup.querySelector(&quot;#closeBtn&quot;);

        if (!adLinkElement || !adImageElement || !loader || !closeButton) {
            console.error(&quot;Popup elements (link, image, loader, or close button) not found!&quot;);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            if (popup.parentNode) popup.parentNode.removeChild(popup);
            return;
        }

        let closeClicks = 0;

        function showPopup() {
            sessionStorage.setItem(&#39;popupHandled&#39;, &#39;true&#39;);
            //console.log(&quot;Showing popup and setting session flag.&quot;);

            const randomIndex = Math.floor(Math.random() * imageUrls.length);
            const selectedImageUrl = imageUrls[randomIndex];
            console.log(&quot;Selected Image URL:&quot;, selectedImageUrl);

            loader.style.display = &#39;block&#39;;
            adLinkElement.style.display = &#39;none&#39;;
            adImageElement.src = &#39;&#39;;

            adImageElement.src = selectedImageUrl;

            adImageElement.onload = () =&gt; {
                console.log(&quot;Image loaded successfully.&quot;);
                loader.style.display = &#39;none&#39;;
                adLinkElement.style.display = &#39;block&#39;;
            };

            adImageElement.onerror = () =&gt; {
                console.error(&quot;Failed to load image:&quot;, selectedImageUrl);
                loader.style.display = &#39;none&#39;;
            };

            overlay.style.display = &quot;block&quot;;
            popup.style.display = &quot;block&quot;;
            void popup.offsetHeight;
            popup.style.opacity = &quot;1&quot;;
            popup.style.transform = &quot;translate(-50%, -50%) scale(1)&quot;;
        }

        function hidePopup() {
            popup.style.opacity = &quot;0&quot;;
            popup.style.transform = &quot;translate(-50%, -50%) scale(0.8)&quot;;
            setTimeout(() =&gt; {
                overlay.style.display = &quot;none&quot;;
                popup.style.display = &quot;none&quot;;
                //console.log(&quot;Popup hidden.&quot;);
            }, 300);
        }

        let popupTimer = setTimeout(showPopup, 5000);

        adLinkElement.addEventListener(&#39;click&#39;, function() {
            //console.log(&quot;Ad link clicked, opening:&quot;, adClickUrl);
            sessionStorage.setItem(&#39;popupHandled&#39;, &#39;true&#39;);
            hidePopup();
            clearTimeout(popupTimer);
        });

        closeButton.addEventListener(&quot;click&quot;, function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (closeClicks === 0) {
                //console.log(&quot;First close click - opening tab:&quot;, adClickUrl);
                window.open(adClickUrl, &quot;_blank&quot;);
                sessionStorage.setItem(&#39;popupHandled&#39;, &#39;true&#39;);
                closeClicks++;
                
            } else {
                //console.log(&quot;Second close click - hiding popup.&quot;);
                hidePopup();
                clearTimeout(popupTimer);
            }
        });

    });
