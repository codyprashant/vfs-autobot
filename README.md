# VFS AutoBot
This Autobot is written as MERN for getting slots on scheduled manner by fetching the information from VFS Global site.

Related Projects are available at below projects for frontend to visualize data
Backend for Frontend component : - https://github.com/codyprashant/vfs-tracker
Frontend for Slots Tracking : - https://github.com/codyprashant/vfs-tracker-FE

We will merge all three project soon in future.

### How to use:
1.  Clone the repo to local.
2.  Create environment variable(.env) with below parameters:
	VFS_EMAIL
	VFS_PASSWORD
	DB_URL
	NODE_ENV
	SENDGRID_API_KEY
	SENDER_EMAIL
	RECEIVER_EMAIL

3. Run the project locally by using "npm start"

> If you want to see your requests visually on browser.  Change the arguments of headless to false on Line 9 in vfs-autobot\app\controllers\vfsAppointmentChecker.js





