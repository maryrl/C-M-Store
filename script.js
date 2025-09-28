
        // Produtos
        const products = [
            {id:1,name:"Smartphone Pro Max",price:2499.99,image:"📱",description:"Smartphone premium com câmera profissional",downloadLink:"#"},
            {id:2,name:"Laptop Gaming",price:4999.99,image:"💻",description:"Laptop para jogos com placa de vídeo dedicada",downloadLink:"#"},
            {id:3,name:"Fones Bluetooth",price:299.99,image:"🎧",description:"Fones sem fio com cancelamento de ruído",downloadLink:"#"},
            {id:4,name:"Smartwatch",price:899.99,image:"⌚",description:"Relógio inteligente com monitoramento de saúde",downloadLink:"#"},
            {id:5,name:"Tablet Pro",price:1899.99,image:"📱",description:"Tablet profissional para criatividade",downloadLink:"#"},
            {id:6,name:"Console Gaming",price:2999.99,image:"🎮",description:"Console de última geração",downloadLink:"#"}
        ];

        // Cupons
        const coupons = { 'DESCONTO10': 0.10, 'PRIMEIRACOMPRA': 0.15, 'BLACKFRIDAY': 0.20 };

        let cart = [];
        let appliedCoupon = null;

        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const subtotal = document.getElementById('subtotal');
        const total = document.getElementById('total');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const checkoutModal = document.getElementById('checkoutModal');
        const successModal = document.getElementById('successModal');

        function init() {
            renderProducts(); updateCartUI(); setupEventListeners();
        }

        function renderProducts() {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = products.map(product => `
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div class="p-6 text-center">
                        <div class="text-6xl mb-4">${product.image}</div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">${product.name}</h3>
                        <p class="text-gray-600 mb-4">${product.description}</p>
                        <div class="text-2xl font-bold text-purple-600 mb-4">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                        <button onclick="addToCart(${product.id})" class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold">Adicionar ao Carrinho</button>
                    </div>
                </div>`).join('');
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existing = cart.find(item => item.id === productId);
            if (existing) { existing.quantity += 1; } else { cart.push({...product, quantity:1}); }
            updateCartUI();
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId); updateCartUI();
        }

        function updateQuantity(productId, change) {
            const item = cart.find(i => i.id === productId);
            if (item) { item.quantity += change; if (item.quantity <= 0) removeFromCart(productId); else updateCartUI(); }
        }

        function updateCartUI() {
            const totalItems = cart.reduce((s,i)=>s+i.quantity,0);
            cartCount.textContent = totalItems;
            cartItems.innerHTML = cart.length===0 ? '<p class="text-gray-500 text-center py-8">Seu carrinho está vazio</p>' :
                cart.map(item=>`
                    <div class="flex items-center space-x-4 py-4 border-b border-gray-200">
                        <div class="text-2xl">${item.image}</div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800">${item.name}</h4>
                            <p class="text-purple-600 font-bold">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="updateQuantity(${item.id},-1)" class="w-8 h-8 bg-gray-200 rounded-full">-</button>
                            <span class="w-8 text-center font-semibold">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id},1)" class="w-8 h-8 bg-gray-200 rounded-full">+</button>
                        </div>
                        <button onclick="removeFromCart(${item.id})" class="text-red-500">x</button>
                    </div>`).join('');

            const subtotalAmount = cart.reduce((s,i)=>s+i.price*i.quantity,0);
            const discountAmount = appliedCoupon ? subtotalAmount*appliedCoupon.discount : 0;
            const totalAmount = subtotalAmount-discountAmount;

            subtotal.textContent = `R$ ${subtotalAmount.toFixed(2).replace('.',',')}`;
            total.textContent = `R$ ${totalAmount.toFixed(2).replace('.',',')}`;

            document.getElementById('discountRow').style.display = appliedCoupon ? 'flex':'none';
            document.getElementById('discountAmount').textContent = `-R$ ${discountAmount.toFixed(2).replace('.',',')}`;
            checkoutBtn.disabled = cart.length===0;
        }

        function applyCoupon() {
            const code=document.getElementById('couponInput').value.trim().toUpperCase();
            const msg=document.getElementById('couponMessage');
            if(coupons[code]){ appliedCoupon={code,discount:coupons[code]}; msg.innerHTML=`<span class="text-green-600">✓ ${coupons[code]*100}% OFF aplicado</span>`; }
            else { msg.innerHTML='<span class="text-red-600">✗ Cupom inválido</span>'; }
            updateCartUI();
        }

        function setupEventListeners() {
            cartBtn.onclick=()=>cartSidebar.classList.remove('translate-x-full');
            closeCart.onclick=()=>cartSidebar.classList.add('translate-x-full');
            document.getElementById('applyCoupon').onclick=applyCoupon;
            checkoutBtn.onclick=()=>{
                const amount=cart.reduce((s,i)=>s+i.price*i.quantity,0);
                document.getElementById('paymentAmount').textContent=`R$ ${amount.toFixed(2).replace('.',',')}`;
                checkoutModal.style.display='flex';
            };
            document.getElementById('cancelPayment').onclick=()=>checkoutModal.style.display='none';

            // Copiar chave Pix
            document.getElementById('copyPixKey').addEventListener('click',()=>{
                const pixKey=document.getElementById('pixKey');
                pixKey.select(); document.execCommand('copy');
                const btn=document.getElementById('copyPixKey'); const original=btn.textContent;
                btn.textContent='Copiado!'; btn.classList.add('bg-green-500');
                setTimeout(()=>{btn.textContent=original;btn.classList.remove('bg-green-500');},2000);
            });

            // Copiar Pix Copia e Cola
            document.getElementById('copyPixPayload').addEventListener('click',()=>{
                const pixPayload=document.getElementById('pixPayload');
                pixPayload.select(); document.execCommand('copy');
                const btn=document.getElementById('copyPixPayload'); const original=btn.textContent;
                btn.textContent='Copiado!'; btn.classList.add('bg-green-500');
                setTimeout(()=>{btn.textContent=original;btn.classList.remove('bg-green-500');},2000);
            });

            // Confirmar pagamento
            document.getElementById('confirmPayment').onclick=()=>{
                checkoutModal.style.display='none'; successModal.style.display='flex';
                const links=document.getElementById('productLinks'); links.innerHTML=cart.map(item=>
                    `<a href="${item.downloadLink}" class="block w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg">${item.name}</a>`).join('');
                cart=[]; appliedCoupon=null; updateCartUI();
            };
            document.getElementById('closeSuccess').onclick=()=>successModal.style.display='none';
        }

        init();
