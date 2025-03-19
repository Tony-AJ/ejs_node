const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      res.status(500).render('error', { pageTitle: 'Error', path: '/500' });
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId) // Updated deprecated `findByPk` to `findByPk`
    .then(product => {
      if (!product) {
        return res.status(404).render('error', { pageTitle: 'Product Not Found', path: '/404' });
      }
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      console.error('Error fetching product:', err);
      res.status(500).render('error', { pageTitle: 'Error', path: '/500' });
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.error('Error fetching index products:', err);
      res.status(500).render('error', { pageTitle: 'Error', path: '/500' });
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      if (!cart) {
        return res.status(404).render('error', { pageTitle: 'Cart Not Found', path: '/404' });
      }
      return cart.getProducts();
    })
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      console.error('Error fetching cart:', err);
      res.status(500).render('error', { pageTitle: 'Error', path: '/500' });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId); // Updated deprecated `findByPk` to `findByPk`
    })
    .then(product => {
      if (!product) {
        return res.status(404).render('error', { pageTitle: 'Product Not Found', path: '/404' });
      }
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.error('Error adding product to cart:', err);
      res.status(500).render('error', { pageTitle: 'Error', path: '/500' });
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.status(404).render('error', { pageTitle: 'Product Not Found in Cart', path: '/404' });
      }
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.error('Error deleting product from cart:', err);
      res.status(500).render('error', { pageTitle: 'Error', path: '/500' });
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      if (!products || products.length === 0) {
        return res.status(404).render('error', { pageTitle: 'No Products in Cart', path: '/404' });
      }
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity }; // Ensure orderItem is set correctly
              return product;
            })
          );
        });
    })
    .then(() => {
      return fetchedCart.setProducts(null); // Clear the cart after creating the order
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      console.error('Error creating order:', err);
      res.status(500).render('error', { pageTitle: 'Error', path: '/500' });
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] }) // Ensure 'products' association is included
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      console.error('Error fetching orders:', err);
      res.status(500).render('error', { pageTitle: 'Error', path: '/500' });
    });
};
