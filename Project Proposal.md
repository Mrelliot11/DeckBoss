# **DeckBoss Card Collection**
## Team Members
Elliot Dubrow, Mackenzie Blaser, Matthew Wudi

# The Need:
There are thousands of people out there who collect trading cards of different kinds, whether it's Magic: The Gathering, Pokemon or Yu-Gi-Oh! As you start getting into card collecting, it can become very tedious to efficiently keep track of your collection. And if you attempt to sell any cards in your collection, getting information on pricing can be difficult. 

# The Solution:
In that vein, DeckBoss would look to help make the process of keeping track of your collection and building decks easier. DeckBoss is a web based card binder, allowing you to effortlessly add cards to your collection and organize them quickly. It will also allow users to quickly gather information pertaining to buying/selling cards.  

# Competition:

There are several sites that have similar concepts as ours, but many focus on baseball or other trading cards. Other sites also usually have a section for buying and selling cards, while our plan is to just present a very nice interface for a digital collection with the possibility of expansion into the marketplace at a later point in development. 

Some examples of sites we have compared are:

### [Collectors.com](https://www.collectors.com/Shop) 
> A site for searching and trading baseball cards (as well as others. We plan to focus on different sets of cards then what is available on this website, but in the future we could expand to baseball cards as well. This site is also styled with an older style, and isn't as sleek as it could be. We aim to have a simplified, stylized layout that will allow users ease of access to our service.

### [TCG Player](https://www.tcgplayer.com/) 
> Another site to collect and discover trading cards from Pokemon to Magic The Gathering. This site is much closer to what we are going for, but we would like to create a much sleeker and easier to use UI. The bulk of this sites UI is stored in drawer menus and we would like to avoid that, as it gives a cluttered user view and could be massively simplified with a better search feature. There is no way to store a "deck" of cards so to speak, so we aim to change that with our product.


### [AetherHub](https://aetherhub.com/Collection/)
> This site is a Magic The Gathering specific site that is quite similar to our collection idea, but with a vastly different UI. This site allows you to build decks to play against other players with, but again it is quite simple in it's UI and and could use some styling. Our website will aim to increase the usability and improve the look of this concept.


# Sample UI:

## Home Page:
![Home Page](websiteMockupImages/Home-Page.png)

## Search Page:
![Search Page](websiteMockupImages/Search-Page.png)

## User Account Page:
![User Page](websiteMockupImages/User-Page.png)


# Scope:

For the scope of our project, we are mainly focusing on having a working website for users to connect to, create accounts, and host their card collections.

We have decided to host the website on heroku and use postgreSQL as the database. Our website will be written in HTML/CSS/JS, there will be some use of jQuery and several APIs for pricing and card data. We took a look at using a framework like react to create interfaces, but as everyone in the group is more comfortable with basic web design, that is what we are going to use.
	
Our project is not a website to buy or sell cards, it is just a site to collect and price digital tokens of said cards and allow for users to present those collections to others in a nice layout. 
	
Our minimum criteria for success:
	
1. As a user, I want to be able to create an account and add cards
2. As a user, I want to be able to search for cards and get pricing data
3. As a user, I want to be able to share my card collection with others.


# Pitfalls:

There are many potential pitfalls in this project. Group scheduling, keeping to proper scope and preventing scope drift. Some people in our group work and so working hours on the project might spill into the later evenings. We also will have to deal with making sure heroku has everything we need, and has the ability to scale for our userbase.

To minimize these issues, we are going to try to stick to a schedule of work. We are going to be delegating out tasks to different members, to ensure that our work doesn't overlap and that merge conflicts can be avoided. We are also going to ensure that everyone's coding environment is set up properly, as to make sure there are no issues there. Since we are using a simple tech stack for web dev, it should be easier, so the main points to check will be git and heroku set ups.

So far, unless there are schedule changes, all members will be available throughout the term to work on this project.

There are going to be several APIs that we will need to learn and apply during this project. So far, we've identified at least 1 we need so far, [a pricing and card data API called pokemontcg.io](https://pokemontcg.io/)
	
This API offers easy access to JSON data about cards, and will allow us to deliver card information such as pricing and images to the user in a straightforward manner.

In order to protect user data, we will have to apply several concepts of web security, including sanitizing input strings and preventing SQL injections. We are going to be using the most up to date user Auth specifications, and plan to continuously test our security through pen testing methods. Our user accounts will also take very little to no user meta data, in order to give users control over what data they share to the public or not.

In terms of concrete issues, two that come up are:
	
- How do we prevent user data exposure/deletion/alteration via sql attacks
- How can we prevent fraudulent access to accounts from occurring.

For issue #1, the main way to deal with this would be to sanitize all strings before they are allowed to interact with the database. PostgreSQL has a built in way to sanitize strings as seen in [this github PR](https://github.com/dwyl/learn-postgresql/issues/64) and as such we will be able to design sanitization functions for our data.

For issue #2, besides preventing SQL Injections, we will also allow very fine tuning over user data by the user. As a site with no actual buying or selling yet, it will be much easier to not have to take personal data from the user and as such will prevent exposure of that data. As data will mainly be accessed through heroku, having proper permissions set up to prevent malicious access will be tantamount. We will also be using hashing to verify passwords, as to prevent plaintext exposure.
