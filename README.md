# wad2_thegreentree

1. Access our website through this link: https://nathania02.github.io/wad2_thegreentree/

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

----------------

UPDATES ADDED SINCE PRESENTATION

1. Like button now changes color when a post is liked
2. Reviews is now a drop down select (1-5) and required fields
3. Comments page bootstrap fixed

----------------

General guidelines for website usage

PROFILE

1. Sign Up
    - Form validation is done (email is checked, passwords should match and be strong)

2. Log In
    - Authentication is done via FireBase Authentication
3. Seller's portal - you can view all your products - delete/edit quantity for them; you can also view the orders made for your product. 
4. My purchases - view all your purchases
COMMUNITY

1. 6 different static communities
2. MUST be logged in to create a post - or button will not show
3. POST CREATION - You can choose to upload an image - if no image is chosen, the default image for thegreentree will be used
4. COMMENTS - You must be logged in to post/like; alert is thrown if not.


MARKETPLACE

1. Can view items if not logged in but cannot add to cart
2. If you own the item, you cannot add it to cart/review it
3. For each item, if there is no quantity specified in the item.html page, it means that it is made to order (sellers will input 999 during creation. if it is not made to order, a quantity will be displayed)
4. When listing an item, you HAVE to upload at least one image - you can upload until 5 (all form validations are stated in the page)
5. When an order is placed - there is a logic up until checkout for pickup, and up until seller dispatches the order for delivery.

----------------------------------------------------------------------------------------------------------------------------

App works on mobile, but the marketplace a bit hard to click (as the more information buttons appears on hover)