1. Access our website through this link: https://nathania02.github.io/wad2_thegreentree/

PRESENTATION LINK: https://youtu.be/c3fNq9OSrWY

2. You can choose to create a new account using signup or login to an existing account using login or view the website not logged in. Below are the test credientials

3. Have fun using our website!

test credientials:

1. buyer's perspective:
   email: testaccountdemo@gmail.com
   password: Coolboy123@

2. seller's perspective:
   email: lana176@smu.edu.sg
   password: Coolboy123@

however we recommend creating your own account and going through the journey for yourself :D

extra credentials to use:

1. email: emmawatson@gmail.com
   password: Coolboy123@

---

UPDATES ADDED SINCE PRESENTATION

1. Like button now changes color when a post is liked
2. Reviews rating is now a drop down select
3. Comments page bootstrap fixed
4. Removed Typed.js & Marquee elements as per the feedback

---

General guidelines for website usage

PROFILE

1. Sign Up

   - Form validation is done (email is checked, passwords should match and be strong)

2. Log In
   - Authentication is done via FireBase Authentication
3. Seller's portal - you can view all your products - delete/edit quantity for them; you can also view the orders made for your product.
4. My purchases - view all your purchases
   COMMUNITY

5. 6 different static communities
6. MUST be logged in to create a post - or button will not show
7. POST CREATION - You can choose to upload an image - if no image is chosen, the default image for thegreentree will be used
8. COMMENTS - You must be logged in to post/like; alert is thrown if not.

MARKETPLACE

1. Can view items if not logged in but cannot add to cart
2. If you own the item, you cannot add it to cart/review it
3. For each item, if there is no quantity specified in the item.html page, it means that it is made to order (sellers will input 999 during creation. if it is not made to order, a quantity will be displayed)
4. When listing an item, you HAVE to upload at least one image - you can upload until 5 (all form validations are stated in the page); specify 999 if the item is made to order. 
5. When an order is placed - there is a logic up until checkout for pickup, and up until seller dispatches the order for delivery - if the item is not made to order, the stock quantity will be reduced from stock

---

NAVBAR

1. List an Item & Cart only appear when user is logged in. 