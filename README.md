# OrderHere
Digital menu - ordering mobile client/server app built with Ionic Framework and React

## Requirements
### Server
    • Shops table in the database -> restaurant info
    • Menu with item types and items listed.
    • Tables and related orders.
    • Requests table in the database. -> tableNo, purpose of the request(help/checkout).
    • User type waiter(admin) sign up and sign in functionality.
    • If the table is available, function to change the owner to the customer's randomly generated id.
    • When the customer checks out, change the table into available, with no owner.

### Mobile Client
    • ( for customers ) scanning qr code and claiming the table if it is available.
    • ( for customers ) function to add to order and send the order to the table which has the matching owner id.
    • ( for customers ) function to call a waiter for help or request the check.
    • ( for customers ) function to search for items in the menu by name.
    
    > Pages will be rendered based on authentication and authorization.
    >> ( only logged in admins are allowed to see or do the things below )

    • ( for admins ) see tables grid, current orders and waiter requests.
    • ( for admins ) functions to manipulate the menu.
    • ( for admins ) function to complete or cancel the orders.
    • ( for admins ) function to manipulate table information such as ( owned, reserved, empty/available).
