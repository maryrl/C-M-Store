  const products = [
            {
                id: 1,
                name: "Canva Pro Premium",
                description: "Acesso completo ao Canva Pro por 12 meses",
                price: 29.90,
                originalPrice: 59.90,
                icon: "🎨",
                color: "from-blue-500 to-purple-600"
            },
            {
                id: 2,
                name: "YouTube Premium",
                description: "YouTube sem anúncios + YouTube Music",
                price: 19.90,
                originalPrice: 39.90,
                icon: "📺",
                color: "from-red-500 to-pink-600"
            },
            {
                id: 3,
                name: "Netflix Premium",
                description: "Conta Netflix Premium 4K por 6 meses",
                price: 24.90,
                originalPrice: 49.90,
                icon: "🎬",
                color: "from-red-600 to-black"
            },
            {
                id: 4,
                name: "Spotify Premium",
                description: "Música sem limites por 12 meses",
                price: 15.90,
                originalPrice: 31.90,
                icon: "🎵",
                color: "from-green-500 to-green-700"
            },
            {
                id: 5,
                name: "Adobe Creative Suite",
                description: "Photoshop, Illustrator e mais por 6 meses",
                price: 49.90,
                originalPrice: 99.90,
                icon: "🎭",
                color: "from-purple-600 to-blue-600"
            },
            {
                id: 6,
                name: "Microsoft Office 365",
                description: "Pacote completo Office por 12 meses",
                price: 34.90,
                originalPrice: 69.90,
                icon: "💼",
                color: "from-blue-600 to-indigo-600"
            }
        ];

        let cart = [];
        let currentProduct = null;
        let currentTotal = 0;
        let appliedCoupon = null;
        
        const coupons = {
            'MEGA50': { discount: 0.5, description: '50% de desconto' },
            'DESCONTO20': { discount: 0.2, description: '20% de desconto' },
            'PRIMEIRA10': { discount: 0.1, description: '10% de desconto' }
        };

        function renderProducts() {
            const grid = document.getElementById('products-grid');
            grid.innerHTML = products.map(product => `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden card-hover">
                    <div class="bg-gradient-to-r ${product.color} p-6 text-white text-center">
                        <div class="text-4xl mb-2">${product.icon}</div>
                        <h3 class="text-xl font-bold">${product.name}</h3>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-600 mb-4">${product.description}</p>
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <span class="text-sm text-gray-500 line-through">R$ ${product.originalPrice.toFixed(2)}</span>
                                <span class="text-2xl font-bold text-green-600 ml-2">R$ ${product.price.toFixed(2)}</span>
                            </div>
                            <span class="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                                -${Math.round((1 - product.price/product.originalPrice) * 100)}%
                            </span>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="addToCart(${product.id})" class="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
                                🛒 Carrinho
                            </button>
                            <button onclick="buyProduct(${product.id})" class="flex-1 bg-gradient-to-r ${product.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
                                Comprar
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            updateCartCount();
            
            // Mostrar feedback visual
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = '✅ Adicionado!';
            button.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 1500);
        }

        function openCart() {
            renderCartItems();
            document.getElementById('cart-modal').classList.remove('hidden');
            document.getElementById('cart-modal').classList.add('flex');
        }

        function closeCart() {
            document.getElementById('cart-modal').classList.add('hidden');
            document.getElementById('cart-modal').classList.remove('flex');
        }

        function renderCartItems() {
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Seu carrinho está vazio</p>';
                cartTotal.textContent = 'R$ 0,00';
                return;
            }
            
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">${item.icon}</span>
                        <div>
                            <h4 class="font-semibold">${item.name}</h4>
                            <p class="text-sm text-gray-600">R$ ${item.price.toFixed(2)} cada</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="flex items-center space-x-2">
                            <button onclick="updateQuantity(${item.id}, -1)" class="bg-gray-300 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-400 transition">-</button>
                            <span class="font-semibold">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="bg-gray-300 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-400 transition">+</button>
                        </div>
                        <span class="font-bold text-green-600">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                        <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 ml-2">🗑️</button>
                    </div>
                </div>
            `).join('');
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        }

        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    renderCartItems();
                    updateCartCount();
                }
            }
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            renderCartItems();
            updateCartCount();
        }

        function checkoutCart() {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            
            closeCart();
            openPaymentModal();
        }

        function buyProduct(productId) {
            const product = products.find(p => p.id === productId);
            cart = [{ ...product, quantity: 1 }];
            updateCartCount();
            openPaymentModal();
        }

        function openPaymentModal() {
            // Calcular total
            currentTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Renderizar resumo do pedido
            const orderSummary = document.getElementById('order-summary');
            orderSummary.innerHTML = cart.map(item => `
                <div class="flex justify-between text-sm mb-1">
                    <span>${item.name} x${item.quantity}</span>
                    <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
            
            // Resetar cupom
            appliedCoupon = null;
            document.getElementById('coupon-input').value = '';
            document.getElementById('coupon-message').innerHTML = '';
            
            updateFinalTotal();
            generatePixCode();
            
            document.getElementById('payment-modal').classList.remove('hidden');
            document.getElementById('payment-modal').classList.add('flex');
        }

        function updateFinalTotal() {
            let finalTotal = currentTotal;
            
            if (appliedCoupon) {
                finalTotal = currentTotal * (1 - appliedCoupon.discount);
            }
            
            document.getElementById('final-total').textContent = `R$ ${finalTotal.toFixed(2)}`;
            return finalTotal;
        }

        function applyCoupon() {
            const couponCode = document.getElementById('coupon-input').value.toUpperCase();
            const messageDiv = document.getElementById('coupon-message');
            
            if (coupons[couponCode]) {
                appliedCoupon = coupons[couponCode];
                messageDiv.innerHTML = `<span class="text-green-600">✅ Cupom aplicado: ${appliedCoupon.description}</span>`;
                updateFinalTotal();
                generatePixCode();
            } else {
                messageDiv.innerHTML = '<span class="text-red-600">❌ Cupom inválido</span>';
            }
        }

        function generatePixCode() {
            const finalTotal = updateFinalTotal();
            const pixData = `00020101021126580014br.gov.bcb.pix0136f20876f6-3d1c-44f8-9a8d-12a32a78ba095204000053039865802BR5921MARIA DAS G R LUCIANO6005CRATO62070503***63049826`;
            
            document.getElementById('pix-code').textContent = pixData;
            
            QRCode.toCanvas(document.getElementById('qr-code'), pixData, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
        }

        function copyPixCode() {
            const pixCode = document.getElementById('pix-code').textContent;
            navigator.clipboard.writeText(pixCode).then(() => {
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = '✅ Copiado!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        }

        function closeModal() {
            document.getElementById('payment-modal').classList.add('hidden');
            document.getElementById('payment-modal').classList.remove('flex');
        }

        function closeModal() {
            document.getElementById('payment-modal').classList.add('hidden');
            document.getElementById('payment-modal').classList.remove('flex');
        }

        let paymentTimer;
        let paymentProgress = 0;
        let currentPurchasedProducts = [];

        function confirmPayment() {
            closeModal();
            startPaymentVerification();
        }

        function startPaymentVerification() {
            // Mostrar modal de confirmação
            document.getElementById('payment-confirmation-modal').classList.remove('hidden');
            document.getElementById('payment-confirmation-modal').classList.add('flex');
            
            // Simular verificação de pagamento (5 minutos = 300 segundos)
            let timeLeft = 300;
            paymentProgress = 0;
            
            paymentTimer = setInterval(() => {
                timeLeft--;
                paymentProgress += (100 / 300);
                
                // Atualizar timer
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                document.getElementById('payment-timer').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                // Atualizar barra de progresso
                document.getElementById('payment-progress').style.width = `${paymentProgress}%`;
                
                // Simular confirmação de pagamento após 8-15 segundos
                if (timeLeft <= 285 && Math.random() > 0.7) {
                    clearInterval(paymentTimer);
                    paymentConfirmed();
                }
                
                // Timeout
                if (timeLeft <= 0) {
                    clearInterval(paymentTimer);
                    paymentTimeout();
                }
            }, 1000);
        }

        function paymentConfirmed() {
            // Fechar modal de confirmação
            document.getElementById('payment-confirmation-modal').classList.add('hidden');
            document.getElementById('payment-confirmation-modal').classList.remove('flex');
            
            // Preparar produtos comprados
            currentPurchasedProducts = [...cart];
            
            // Mostrar modal de sucesso
            renderPurchasedProducts();
            document.getElementById('success-modal').classList.remove('hidden');
            document.getElementById('success-modal').classList.add('flex');
            
            // Limpar carrinho após compra
            cart = [];
            updateCartCount();
        }

        function paymentTimeout() {
            document.getElementById('payment-confirmation-modal').classList.add('hidden');
            document.getElementById('payment-confirmation-modal').classList.remove('flex');
            alert('Tempo limite para pagamento expirado. Tente novamente.');
        }

        function cancelPaymentCheck() {
            clearInterval(paymentTimer);
            document.getElementById('payment-confirmation-modal').classList.add('hidden');
            document.getElementById('payment-confirmation-modal').classList.remove('flex');
        }

        function renderPurchasedProducts() {
            const container = document.getElementById('purchased-products');
            container.innerHTML = currentPurchasedProducts.map(product => `
                <div class="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">${product.icon}</span>
                        <div>
                            <h4 class="font-semibold">${product.name}</h4>
                            <p class="text-sm text-gray-600">Quantidade: ${product.quantity}</p>
                        </div>
                    </div>
                    <button onclick="openProductDetails(${product.id})" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition">
                        Ver Detalhes
                    </button>
                </div>
            `).join('');
        }

        function openProductDetails(productId) {
            const product = currentPurchasedProducts.find(p => p.id === productId);
            if (!product) return;

            // Preencher dados do produto
            document.getElementById('product-icon').textContent = product.icon;
            document.getElementById('product-title').textContent = product.name;
            document.getElementById('product-description').textContent = product.description;

            // Gerar instruções e credenciais específicas
            const productData = generateProductData(product);
            document.getElementById('product-instructions').innerHTML = productData.instructions;
            document.getElementById('product-credentials').textContent = productData.credentials;

            // Mostrar modal
            document.getElementById('product-details-modal').classList.remove('hidden');
            document.getElementById('product-details-modal').classList.add('flex');
        }

        function generateProductData(product) {
            const data = {
                1: { // Canva Pro
                    instructions: `
                        1. Acesse <strong>canva.com</strong><br>
                        2. Faça login com os dados fornecidos<br>
                        3. Aproveite todos os recursos Premium<br>
                        4. Válido por 12 meses
                    `,
                    credentials: `Email: canva.premium.${Math.random().toString(36).substr(2, 8)}@gmail.com\nSenha: Canva${Math.random().toString(36).substr(2, 6)}2024`
                },
                2: { // YouTube Premium
                    instructions: `
                        1. Acesse <strong>youtube.com</strong><br>
                        2. Faça login com os dados fornecidos<br>
                        3. Aproveite vídeos sem anúncios<br>
                        4. Inclui YouTube Music Premium
                    `,
                    credentials: `Email: yt.premium.${Math.random().toString(36).substr(2, 8)}@gmail.com\nSenha: YT${Math.random().toString(36).substr(2, 8)}2024`
                },
                3: { // Netflix
                    instructions: `
                        1. Acesse <strong>netflix.com</strong><br>
                        2. Faça login com os dados fornecidos<br>
                        3. Qualidade 4K disponível<br>
                        4. Válido por 6 meses
                    `,
                    credentials: `Email: netflix.4k.${Math.random().toString(36).substr(2, 8)}@gmail.com\nSenha: NF${Math.random().toString(36).substr(2, 8)}2024`
                },
                4: { // Spotify
                    instructions: `
                        1. Acesse <strong>spotify.com</strong><br>
                        2. Faça login com os dados fornecidos<br>
                        3. Música sem anúncios e offline<br>
                        4. Válido por 12 meses
                    `,
                    credentials: `Email: spotify.premium.${Math.random().toString(36).substr(2, 8)}@gmail.com\nSenha: SP${Math.random().toString(36).substr(2, 8)}2024`
                },
                5: { // Adobe
                    instructions: `
                        1. Baixe o Adobe Creative Cloud<br>
                        2. Faça login com os dados fornecidos<br>
                        3. Instale Photoshop, Illustrator, etc.<br>
                        4. Válido por 6 meses
                    `,
                    credentials: `Email: adobe.creative.${Math.random().toString(36).substr(2, 8)}@gmail.com\nSenha: AD${Math.random().toString(36).substr(2, 8)}2024`
                },
                6: { // Office 365
                    instructions: `
                        1. Acesse <strong>office.com</strong><br>
                        2. Faça login com os dados fornecidos<br>
                        3. Baixe Word, Excel, PowerPoint<br>
                        4. Válido por 12 meses
                    `,
                    credentials: `Email: office365.${Math.random().toString(36).substr(2, 8)}@outlook.com\nSenha: OF${Math.random().toString(36).substr(2, 8)}2024`
                }
            };

            return data[product.id] || {
                instructions: 'Instruções serão enviadas por email.',
                credentials: 'Credenciais serão enviadas por email.'
            };
        }

        function copyCredentials() {
            const credentials = document.getElementById('product-credentials').textContent;
            navigator.clipboard.writeText(credentials).then(() => {
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = '✅ Copiado!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        }

        function downloadProductFile() {
            // Simular download de arquivo
            const product = currentPurchasedProducts.find(p => 
                p.name === document.getElementById('product-title').textContent
            );
            
            if (product) {
                // Criar arquivo de texto com as informações
                const content = `
PRODUTO: ${product.name}
DESCRIÇÃO: ${product.description}

DADOS DE ACESSO:
${document.getElementById('product-credentials').textContent}

INSTRUÇÕES:
${document.getElementById('product-instructions').textContent.replace(/<[^>]*>/g, '')}

SUPORTE: contato@infostore.com
WhatsApp: (88) 98839-3930

© 2024 InfoStore - Todos os direitos reservados
                `;
                
                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${product.name.replace(/\s+/g, '_')}_InfoStore.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        }

        function downloadAllProducts() {
            currentPurchasedProducts.forEach((product, index) => {
                setTimeout(() => {
                    const productData = generateProductData(product);
                    const content = `
PRODUTO: ${product.name}
DESCRIÇÃO: ${product.description}
QUANTIDADE: ${product.quantity}

DADOS DE ACESSO:
${productData.credentials}

INSTRUÇÕES:
${productData.instructions.replace(/<[^>]*>/g, '')}

SUPORTE: contato@infostore.com
WhatsApp: (88) 98839-3930

© 2024 InfoStore - Todos os direitos reservados
                    `;
                    
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${product.name.replace(/\s+/g, '_')}_InfoStore.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, index * 500); // Delay entre downloads
            });
        }

        function closeProductDetails() {
            document.getElementById('product-details-modal').classList.add('hidden');
            document.getElementById('product-details-modal').classList.remove('flex');
        }

        function closeSuccessModal() {
            document.getElementById('success-modal').classList.add('hidden');
            document.getElementById('success-modal').classList.remove('flex');
            currentPurchasedProducts = [];
        }

        function updateCartCount() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cart-count').textContent = totalItems;
            
            if (totalItems > 0) {
                document.getElementById('cart-count').style.display = 'flex';
            } else {
                document.getElementById('cart-count').style.display = 'none';
            }
        }

        // Inicializar a página
        renderProducts();

        // Animação do banner promocional
        setInterval(() => {
            const banner = document.querySelector('.banner-slide');
            banner.style.animation = 'none';
            setTimeout(() => {
                banner.style.animation = 'slideIn 0.8s ease-out';
            }, 100);
        }, 10000);
