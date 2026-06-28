# 5. Sharing logic between event handlers

```tsx
// ❌ Fires on mount/refresh if product.isInCart is already true —
// an Effect runs because the component was *displayed*, not because of a click
useEffect(() => {
  if (product.isInCart) {
    showNotification(`Added ${product.name} to the shopping cart!`);
  }
}, [product]);

// ✅ Extract the shared behavior into a plain function, call it from every handler that needs it
function buyProduct() {
  addToCart(product);
  showNotification(`Added ${product.name} to the shopping cart!`);
}

function handleBuyClick() {
  buyProduct();
}

function handleCheckoutClick() {
  buyProduct();
  navigateTo('/checkout');
}
```
