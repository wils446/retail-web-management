# Retail Web Management

## Server

### **Auth**

- register `POST` `/api/auth/register`

  - access token not required
  - body :
    - username `string`
    - password `string`
  - response example :

  ```json
  {
  	"username": "abcreta",
  	"id": "ef09e267-e2a3-4c7c-9689-72365d20956d",
  	"created_at": "2024-01-20T13:14:29.807Z",
  	"updated_at": "2024-01-20T13:14:29.807Z",
  	"role": "none"
  }
  ```

- login `POST` `/api/auth/login`
  - access token not required
  - body :
    - username `string`
    - password `string`
  - response example :
  ```json
  {
  	"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzM2ZmOTg4Ny1iZGE3LTQ1ZmQtYjhkZi1iMzc0YWFhNTk0YjIiLCJpYXQiOjE3MDU3NTY3NjIsImV4cCI6MTcwNjk2NjM2Mn0.vcJ1lyPLprxieFEOr_GUjSIDu9JKdnYyEnGPpV0zilM"
  }
  ```

### **Me**

- get user `GET` `/api/me`
  - access token required
  - response example :
  ```json
  {
  	"id": "2f8f17bb-9d18-4f3e-bee3-8e3c28718ee7",
  	"username": "testing",
  	"role": "none"
  }
  ```
- update password `PATCH` `/api/me`
  - access token required
  - body :
    - oldPassword `string`
    - newPassword `string`
  - response : `{}`

### **User**

- get users `GET` `/api/user`
  - access token required
  - response example :
  ```json
  {
  	"counts": 4,
  	"users": [
  		{
  			"id": "33ff9887-bda7-45fd-b8df-b374aaa594b2",
  			"username": "wilson",
  			"role": "admin"
  		},
  		{
  			"id": "019ca281-cb05-4ef0-91ae-c7abc71e9a08",
  			"username": "abc",
  			"role": "none"
  		},
  		{
  			"id": "ef09e267-e2a3-4c7c-9689-72365d20956d",
  			"username": "abcreta",
  			"role": "none"
  		},
  		{
  			"id": "2f8f17bb-9d18-4f3e-bee3-8e3c28718ee7",
  			"username": "testing",
  			"role": "none"
  		}
  	]
  }
  ```
- update user `PATCH` `/api/user/:id`
  - access token required
  - role admin required
  - body :
    - username `string` `optional`
    - password `string` `optional`
    - adminPassword `string`
  - response example :
  ```json
  {
  	"id": "2f8f17bb-9d18-4f3e-bee3-8e3c28718ee7",
  	"username": "testing",
  	"role": "none"
  }
  ```
- delete user `DELETE` `/api/user/:id`

  - access token required
  - role admin required
  - body :
    - adminPassword `string`
  - response example :

  ```json
  {
  	"message": "5fe327e4-e10a-4743-91e6-3be105a5a9f8 deleted"
  }
  ```

### **Item**

- create item `POST` `/api/item`
  - access token required
  - body :
    - name `string`
    - price `number` `optional`
    - categoryId `string` `optional`
  - response example :
  ```json
  {
  	"name": "Licensed Metal Bike",
  	"price": 30000,
  	"category": null,
  	"id": "bc947290-e852-42c4-9bfb-9ed9dde66c25",
  	"created_at": "2024-01-20T13:54:22.638Z",
  	"updated_at": "2024-01-20T13:54:22.638Z"
  }
  ```
- get items `GET` `/api/item`
  - access token required
  - body : `{}`
  - response example :
  ```json
  {
  	"count": 2,
  	"items": [
  		{
  			"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  			"created_at": "2024-01-19T07:25:54.158Z",
  			"updated_at": "2024-01-19T07:25:54.158Z",
  			"name": "Handcrafted Metal Pants",
  			"price": 100000,
  			"category": null,
  			"stocks": [
  				{
  					"id": "8357b187-4743-4ec0-a8c6-e07af2c74f71",
  					"created_at": "2024-01-19T18:21:53.716Z",
  					"updated_at": "2024-01-19T18:21:53.716Z",
  					"stock": 5,
  					"cost": 80000
  				}
  			]
  		},
  		{
  			"id": "bc947290-e852-42c4-9bfb-9ed9dde66c25",
  			"created_at": "2024-01-20T13:54:22.638Z",
  			"updated_at": "2024-01-20T13:54:22.638Z",
  			"name": "Licensed Metal Bike",
  			"price": 30000,
  			"category": null,
  			"stocks": []
  		}
  	]
  }
  ```
- update item `PATCH` `/api/item/:id`
  - access token required
  - body :
    - name `string` `optional`
    - price `number` `optional`
    - categoryId `string` `optional`
  - response example :
  ```json
  {
  	"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  	"created_at": "2024-01-19T07:25:54.158Z",
  	"updated_at": "2024-01-19T07:25:54.158Z",
  	"name": "Handcrafted Metal Pants",
  	"price": 100000
  }
  ```
- delete item `DELETE` `/api/item/:id`

  - access token required
  - body : `{}`
  - response example :

  ```json
  {
  	"message": "bc947290-e852-42c4-9bfb-9ed9dde66c25 deleted"
  }
  ```

### **Category**

- create category `POST` `/api/category`

  - access token required
  - body :
    - name `string`
  - response example :

  ```json
  {
  	"name": "Sports",
  	"id": "ff8e5697-7210-45f7-8539-c33d939fe487",
  	"created_at": "2024-01-20T14:24:45.997Z",
  	"updated_at": "2024-01-20T14:24:45.997Z"
  }
  ```

- get categories `GET` `/api/category`
  - access token required
  - body : `{}`
  - response example :
  ```json
  {
  	"counts": 1,
  	"categories": [
  		{
  			"id": "ff8e5697-7210-45f7-8539-c33d939fe487",
  			"created_at": "2024-01-20T14:24:45.997Z",
  			"updated_at": "2024-01-20T14:24:45.997Z",
  			"name": "Sports"
  		}
  	]
  }
  ```
- update category `PATCH` `/api/category/:id`
  - access token required
  - body :
    - name `string` `optional`
  - response example :
  ```json
  {
  	"id": "ff8e5697-7210-45f7-8539-c33d939fe487",
  	"created_at": "2024-01-20T14:24:45.997Z",
  	"updated_at": "2024-01-20T14:24:45.997Z",
  	"name": "Sports"
  }
  ```
- delete category `DELETE` `/api/category/:id`
  - access token required
  - body : `{}`
  - response example :
  ```json
  {
  	"message": "d74bc7c1-85e3-4e11-acc6-05e5208a193b deleted"
  }
  ```

### **Cart**

- create cart `POST` `/api/cart`
  - access token required
  - body :
    - name `string`
  - response example :
  ```json
  {
  	"name": "Lakin Group",
  	"id": "39c30686-4a9c-4f07-9322-70eb9ed847a5",
  	"created_at": "2024-01-20T14:32:46.687Z",
  	"updated_at": "2024-01-20T14:32:46.687Z",
  	"discount": 0
  }
  ```
- add item to cart `POST` `/api/cart/:id`
  - access token required
  - body :
    - itemId `string`
    - quantity `number`
    - price `number` `optional`
  - response example :
  ```json
  {
  	"cartId": "39c30686-4a9c-4f07-9322-70eb9ed847a5",
  	"cartItem": {
  		"name": "Handcrafted Metal Pants",
  		"quantity": 1,
  		"cart": {
  			"id": "39c30686-4a9c-4f07-9322-70eb9ed847a5",
  			"created_at": "2024-01-20T14:32:46.687Z",
  			"updated_at": "2024-01-20T14:32:46.687Z",
  			"name": "Lakin Group",
  			"discount": 0,
  			"cartItems": []
  		},
  		"item": {
  			"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  			"created_at": "2024-01-19T07:25:54.158Z",
  			"updated_at": "2024-01-19T07:25:54.158Z",
  			"name": "Handcrafted Metal Pants",
  			"price": 100000,
  			"stocks": [
  				{
  					"id": "8357b187-4743-4ec0-a8c6-e07af2c74f71",
  					"created_at": "2024-01-19T18:21:53.716Z",
  					"updated_at": "2024-01-19T18:21:53.716Z",
  					"stock": 5,
  					"cost": 80000
  				}
  			]
  		},
  		"price": 100000,
  		"id": "dae3272a-ba79-4c5d-a032-8dff78be71a7",
  		"created_at": "2024-01-20T14:36:25.999Z",
  		"updated_at": "2024-01-20T14:36:25.999Z"
  	}
  }
  ```
- update cart `PATCH` `/api/cart/:id`
  - access token required
  - body :
    - name `string` `optional`
  - response example :
  ```json
  {
  	"id": "39c30686-4a9c-4f07-9322-70eb9ed847a5",
  	"created_at": "2024-01-20T14:32:46.687Z",
  	"updated_at": "2024-01-20T14:32:46.687Z",
  	"name": "Lakin Group",
  	"discount": 0,
  	"cartItems": [
  		{
  			"id": "dae3272a-ba79-4c5d-a032-8dff78be71a7",
  			"created_at": "2024-01-20T14:36:25.999Z",
  			"updated_at": "2024-01-20T14:36:25.999Z",
  			"name": "Handcrafted Metal Pants",
  			"quantity": 1,
  			"price": 100000,
  			"item": {
  				"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  				"created_at": "2024-01-19T07:25:54.158Z",
  				"updated_at": "2024-01-19T07:25:54.158Z",
  				"name": "Handcrafted Metal Pants",
  				"price": 100000
  			}
  		}
  	]
  }
  ```
- update cart item `PATCH` `/api/cart/:id/cart-item/:cartItemId`
  - access token required
  - body :
    - quantity `number` `optional`
    - price `number` `optional`
  - response example :
  ```json
  {
  	"cartId": "39c30686-4a9c-4f07-9322-70eb9ed847a5",
  	"cartItem": {
  		"id": "dae3272a-ba79-4c5d-a032-8dff78be71a7",
  		"created_at": "2024-01-20T14:36:25.999Z",
  		"updated_at": "2024-01-21T04:27:22.158Z",
  		"name": "Handcrafted Metal Pants",
  		"quantity": 2,
  		"price": 200000,
  		"item": {
  			"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  			"created_at": "2024-01-19T07:25:54.158Z",
  			"updated_at": "2024-01-19T07:25:54.158Z",
  			"name": "Handcrafted Metal Pants",
  			"price": 100000,
  			"stocks": [
  				{
  					"id": "8357b187-4743-4ec0-a8c6-e07af2c74f71",
  					"created_at": "2024-01-19T18:21:53.716Z",
  					"updated_at": "2024-01-19T18:21:53.716Z",
  					"stock": 5,
  					"cost": 80000
  				}
  			]
  		}
  	}
  }
  ```
- delete cart item `DELETE` `/api/cart/:id/cart-item/:cartItemId`
  - access token required
  - body : `{}`
  - response example :
  ```json
  {
  	"message": "dae3272a-ba79-4c5d-a032-8dff78be71a7 deleted from 39c30686-4a9c-4f07-9322-70eb9ed847a5"
  }
  ```
- delete cart `DELETE` `/api/cart/:id`
  - access token required
  - body : `{}`
  - response example :
  ```json
  {
  	"message": "39c30686-4a9c-4f07-9322-70eb9ed847a5 deleted"
  }
  ```

### **Transaction**

- create transaction `POST` `/api/transaction`
  - access token required
  - body :
    - name `string`
    - cartId `string`
    - paid `boolean`
    - address `string` `optional`
    - city `string` `optional`
    - province `string` `optional`
    - postalCode `string` `optional`
    - country `string` `optional`
  - response example :
  ```json
  {
  	"name": "PT jaya jaya jaya",
  	"paid": true,
  	"createdBy": "testing",
  	"checkoutUser": {
  		"id": "2f8f17bb-9d18-4f3e-bee3-8e3c28718ee7",
  		"username": "testing",
  		"role": "none"
  	},
  	"address": {
  		"address": "Jl Hang Tuah",
  		"city": "Pekanbaru",
  		"country": "Indonesia",
  		"province": null,
  		"postalCode": null,
  		"id": "0036c05d-40f3-4326-8a16-1501534b6c66",
  		"created_at": "2024-01-21T04:36:39.026Z",
  		"updated_at": "2024-01-21T04:36:39.026Z"
  	},
  	"id": "34a21fb3-6b82-42a3-a6fb-6cd76271d20d",
  	"created_at": "2024-01-21T04:36:39.026Z",
  	"updated_at": "2024-01-21T04:36:39.026Z",
  	"discount": 0
  }
  ```
- get transactions `GET` `/api/transaction`
  - access token required
  - body : `{}`
  - response example :
  ```json
  {
  	"transactions": [
  		{
  			"id": "c9cecbcf-cff3-4478-948c-ce2ffb9692ff",
  			"created_at": "2024-01-19T18:27:56.202Z",
  			"updated_at": "2024-01-19T18:27:56.202Z",
  			"name": "PT jaya jaya jaya",
  			"paid": true,
  			"createdBy": "testing",
  			"discount": 0,
  			"checkoutUser": {
  				"id": "2f8f17bb-9d18-4f3e-bee3-8e3c28718ee7",
  				"created_at": "2024-01-17T17:24:35.788Z",
  				"updated_at": "2024-01-20T13:48:33.304Z",
  				"username": "testing",
  				"password": "$2b$10$3fy0DZU4IY47rKJmNGaepe2VKAWtfxUGe22j6uI00IrRZE6basM66",
  				"role": "none"
  			},
  			"items": [
  				{
  					"id": "43c7cf58-6127-437a-ad6c-d48c01275e56",
  					"created_at": "2024-01-19T18:27:56.202Z",
  					"updated_at": "2024-01-19T18:27:56.202Z",
  					"name": "Handcrafted Metal Pants",
  					"quantity": 1,
  					"price": 100000,
  					"stocks": [
  						{
  							"id": "7e85c3f7-8c71-465e-b726-e40f52bb3366",
  							"created_at": "2024-01-19T18:27:56.202Z",
  							"updated_at": "2024-01-19T18:27:56.202Z",
  							"stock": 1,
  							"cost": 76000
  						}
  					]
  				}
  			],
  			"address": {
  				"id": "59b0f164-bf97-4db1-9858-c24883ea47a3",
  				"created_at": "2024-01-19T18:27:56.202Z",
  				"updated_at": "2024-01-19T18:27:56.202Z",
  				"address": "Jl Hang Tuah",
  				"city": "Pekanbaru",
  				"province": null,
  				"postalCode": null,
  				"country": "Indonesia"
  			}
  		},
  		{
  			"id": "34a21fb3-6b82-42a3-a6fb-6cd76271d20d",
  			"created_at": "2024-01-21T04:36:39.026Z",
  			"updated_at": "2024-01-21T04:36:39.026Z",
  			"name": "PT jaya jaya jaya",
  			"paid": true,
  			"createdBy": "testing",
  			"discount": 0,
  			"checkoutUser": {
  				"id": "2f8f17bb-9d18-4f3e-bee3-8e3c28718ee7",
  				"created_at": "2024-01-17T17:24:35.788Z",
  				"updated_at": "2024-01-20T13:48:33.304Z",
  				"username": "testing",
  				"password": "$2b$10$3fy0DZU4IY47rKJmNGaepe2VKAWtfxUGe22j6uI00IrRZE6basM66",
  				"role": "none"
  			},
  			"items": [
  				{
  					"id": "30f37483-ca87-4e76-8cf5-b291f01b0fb7",
  					"created_at": "2024-01-21T04:36:39.026Z",
  					"updated_at": "2024-01-21T04:36:39.026Z",
  					"name": "Handcrafted Metal Pants",
  					"quantity": 1,
  					"price": 100000,
  					"stocks": [
  						{
  							"id": "4b4b80d5-5998-4333-bdfa-dab23d12effe",
  							"created_at": "2024-01-21T04:36:39.026Z",
  							"updated_at": "2024-01-21T04:36:39.026Z",
  							"stock": 1,
  							"cost": 80000
  						}
  					]
  				}
  			],
  			"address": {
  				"id": "0036c05d-40f3-4326-8a16-1501534b6c66",
  				"created_at": "2024-01-21T04:36:39.026Z",
  				"updated_at": "2024-01-21T04:36:39.026Z",
  				"address": "Jl Hang Tuah",
  				"city": "Pekanbaru",
  				"province": null,
  				"postalCode": null,
  				"country": "Indonesia"
  			}
  		}
  	],
  	"counts": 2
  }
  ```
- update transaction `PATCH` `/api/transaction/:id`
  - access token required
  - body :
    - paid `boolean`
  - response example :
  ```json
  {
  	"id": "34a21fb3-6b82-42a3-a6fb-6cd76271d20d",
  	"created_at": "2024-01-21T04:36:39.026Z",
  	"updated_at": "2024-01-21T04:36:39.026Z",
  	"name": "PT jaya jaya jaya",
  	"paid": true,
  	"createdBy": "testing",
  	"discount": 0,
  	"items": [
  		{
  			"id": "30f37483-ca87-4e76-8cf5-b291f01b0fb7",
  			"created_at": "2024-01-21T04:36:39.026Z",
  			"updated_at": "2024-01-21T04:36:39.026Z",
  			"name": "Handcrafted Metal Pants",
  			"quantity": 1,
  			"price": 100000,
  			"stocks": [
  				{
  					"id": "4b4b80d5-5998-4333-bdfa-dab23d12effe",
  					"created_at": "2024-01-21T04:36:39.026Z",
  					"updated_at": "2024-01-21T04:36:39.026Z",
  					"stock": 1,
  					"cost": 80000
  				}
  			]
  		}
  	]
  }
  ```

### **Order**

- create order `POST` `/api/order`
  - access token required
  - body :
    - paid `boolean`
    - items `{quantity: number, itemId: string, cost: number}[]`
    - name `string`
  - response example :
  ```json
  {
  	"id": "e580373a-1ef2-4fe8-a5ef-341ee8a19a38",
  	"created_at": "2024-01-21T04:56:37.223Z",
  	"updated_at": "2024-01-21T04:56:37.223Z",
  	"name": "Fadel and Sons",
  	"paid": true,
  	"createdBy": "testing",
  	"items": [
  		{
  			"id": "0c2098ab-637f-466f-b1c0-41544b8c8a5f",
  			"created_at": "2024-01-21T04:56:37.223Z",
  			"updated_at": "2024-01-21T04:56:37.223Z",
  			"name": "Handcrafted Metal Pants",
  			"quantity": 5,
  			"cost": 300000,
  			"item": {
  				"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  				"created_at": "2024-01-19T07:25:54.158Z",
  				"updated_at": "2024-01-19T07:25:54.158Z",
  				"name": "Handcrafted Metal Pants",
  				"price": 100000
  			}
  		}
  	]
  }
  ```
- get orders `GET` `/api/order`
  - access token required
  - body : `{}`
  - response example :
  ```json
  {
  	"orders": [
  		{
  			"id": "b6808ee7-880c-4a9c-8899-168102df246a",
  			"created_at": "2024-01-19T07:26:42.512Z",
  			"updated_at": "2024-01-19T07:26:42.512Z",
  			"name": "Prosacco, Ernser and Kemmer",
  			"paid": true,
  			"createdBy": "testing",
  			"items": [
  				{
  					"id": "3c6183f0-d914-405d-ae8c-5d56d77bfc7a",
  					"created_at": "2024-01-19T07:26:42.512Z",
  					"updated_at": "2024-01-19T07:26:42.512Z",
  					"name": "Handcrafted Metal Pants",
  					"quantity": 5,
  					"cost": 400000,
  					"item": {
  						"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  						"created_at": "2024-01-19T07:25:54.158Z",
  						"updated_at": "2024-01-19T07:25:54.158Z",
  						"name": "Handcrafted Metal Pants",
  						"price": 100000
  					}
  				}
  			]
  		},
  		{
  			"id": "7ee52b86-f2f0-4b9f-a3cd-058b1b57c6e4",
  			"created_at": "2024-01-19T07:30:54.461Z",
  			"updated_at": "2024-01-19T07:30:54.461Z",
  			"name": "Fadel - Glover",
  			"paid": true,
  			"createdBy": "testing",
  			"items": [
  				{
  					"id": "fe28107e-1e8b-448d-98d0-8a31b236c42b",
  					"created_at": "2024-01-19T07:30:54.461Z",
  					"updated_at": "2024-01-19T07:30:54.461Z",
  					"name": "Handcrafted Metal Pants",
  					"quantity": 10,
  					"cost": 350000,
  					"item": {
  						"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  						"created_at": "2024-01-19T07:25:54.158Z",
  						"updated_at": "2024-01-19T07:25:54.158Z",
  						"name": "Handcrafted Metal Pants",
  						"price": 100000
  					}
  				}
  			]
  		},
  		{
  			"id": "f14ec87b-52be-46b3-9c6e-16dfe192d39b",
  			"created_at": "2024-01-19T09:32:14.306Z",
  			"updated_at": "2024-01-19T09:32:14.306Z",
  			"name": "Smitham - Kovacek",
  			"paid": true,
  			"createdBy": "testing",
  			"items": [
  				{
  					"id": "bb26be1d-176e-4cd4-a3bf-83eca659598b",
  					"created_at": "2024-01-19T09:32:14.306Z",
  					"updated_at": "2024-01-19T09:32:14.306Z",
  					"name": "Handcrafted Metal Pants",
  					"quantity": 5,
  					"cost": 380000,
  					"item": {
  						"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  						"created_at": "2024-01-19T07:25:54.158Z",
  						"updated_at": "2024-01-19T07:25:54.158Z",
  						"name": "Handcrafted Metal Pants",
  						"price": 100000
  					}
  				}
  			]
  		},
  		{
  			"id": "3af87430-fe99-430d-a81a-b5cbd2c4e9a8",
  			"created_at": "2024-01-19T18:21:53.716Z",
  			"updated_at": "2024-01-19T18:21:53.716Z",
  			"name": "Buckridge Group",
  			"paid": true,
  			"createdBy": "testing",
  			"items": [
  				{
  					"id": "d7e297fa-b030-410e-ab49-47f88af56eb2",
  					"created_at": "2024-01-19T18:21:53.716Z",
  					"updated_at": "2024-01-19T18:21:53.716Z",
  					"name": "Handcrafted Metal Pants",
  					"quantity": 5,
  					"cost": 400000,
  					"item": {
  						"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  						"created_at": "2024-01-19T07:25:54.158Z",
  						"updated_at": "2024-01-19T07:25:54.158Z",
  						"name": "Handcrafted Metal Pants",
  						"price": 100000
  					}
  				}
  			]
  		},
  		{
  			"id": "e580373a-1ef2-4fe8-a5ef-341ee8a19a38",
  			"created_at": "2024-01-21T04:56:37.223Z",
  			"updated_at": "2024-01-21T04:56:37.223Z",
  			"name": "Fadel and Sons",
  			"paid": true,
  			"createdBy": "testing",
  			"items": [
  				{
  					"id": "0c2098ab-637f-466f-b1c0-41544b8c8a5f",
  					"created_at": "2024-01-21T04:56:37.223Z",
  					"updated_at": "2024-01-21T04:56:37.223Z",
  					"name": "Handcrafted Metal Pants",
  					"quantity": 5,
  					"cost": 300000,
  					"item": {
  						"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  						"created_at": "2024-01-19T07:25:54.158Z",
  						"updated_at": "2024-01-19T07:25:54.158Z",
  						"name": "Handcrafted Metal Pants",
  						"price": 100000
  					}
  				}
  			]
  		}
  	],
  	"counts": 5
  }
  ```
- update order `PATCH` `/api/order/:id`
  - access token required
  - body :
    - paid `boolean`
  - response example :
  ```json
  {
  	"id": "e580373a-1ef2-4fe8-a5ef-341ee8a19a38",
  	"created_at": "2024-01-21T04:56:37.223Z",
  	"updated_at": "2024-01-21T04:56:37.223Z",
  	"name": "Fadel and Sons",
  	"paid": true,
  	"createdBy": "testing",
  	"items": [
  		{
  			"id": "0c2098ab-637f-466f-b1c0-41544b8c8a5f",
  			"created_at": "2024-01-21T04:56:37.223Z",
  			"updated_at": "2024-01-21T04:56:37.223Z",
  			"name": "Handcrafted Metal Pants",
  			"quantity": 5,
  			"cost": 300000,
  			"item": {
  				"id": "b654cefc-5954-490b-8cd1-3372185adb10",
  				"created_at": "2024-01-19T07:25:54.158Z",
  				"updated_at": "2024-01-19T07:25:54.158Z",
  				"name": "Handcrafted Metal Pants",
  				"price": 100000
  			}
  		}
  	]
  }
  ```

### **Retur**

- get retur `GET` `/api/return`

  - access token required
  - body : `{}`
  - response example :

  ```json
  {
  	"returns": [
  		{
  			"id": "d50e14cf-8c64-4d34-9121-b740e224884a",
  			"created_at": "2024-02-28T05:31:44.186Z",
  			"updated_at": "2024-02-28T05:31:44.186Z",
  			"name": "Kuhn - Howell",
  			"type": "order",
  			"targetId": "9201f5d2-a79e-46f5-9048-644efa3c79b7",
  			"invoiceNumber": "SB-RTN-20240228-001",
  			"returnItem": [
  				{
  					"id": "abda7af6-7a56-4b79-8e21-c44b21ae548d",
  					"created_at": "2024-02-28T05:31:44.186Z",
  					"updated_at": "2024-02-28T05:31:44.186Z",
  					"name": "jaket parasut",
  					"quantity": 4,
  					"returnPrice": 750000,
  					"item": {
  						"id": "ebe18a0a-a5e0-4757-b5a1-f43d9acf0b74",
  						"created_at": "2024-01-31T19:02:59.716Z",
  						"updated_at": "2024-01-31T19:02:59.716Z",
  						"name": "jaket parasut",
  						"price": 250000
  					}
  				}
  			]
  		}
  	]
  }
  ```

- create retur `POST` `/api/return`

  - access token required
  - body :
    - targetId : `string`
    - type : `"order" | "transaction"`
    - items : `{itemId: string, returnPrice: number, quantity: number, isSellable?: boolean}[]`
  - response example :

    - transaction :

    ```json
    {
    	"id": "a2348a81-ac57-44df-8e70-03196f8e16ae",
    	"created_at": "2024-03-05T09:47:54.725Z",
    	"updated_at": "2024-03-05T09:47:54.725Z",
    	"name": "PT jaya jaya jaya",
    	"type": "transaction",
    	"targetId": "111142d1-413c-4f9c-b360-629b1ce82cae",
    	"invoiceNumber": "SB-RTN-20240305-003",
    	"returnItem": [
    		{
    			"id": "afcf613f-529a-4393-838c-ed6d05024077",
    			"created_at": "2024-03-05T09:47:54.725Z",
    			"updated_at": "2024-03-05T09:47:54.725Z",
    			"name": "Refined Plastic Sausages",
    			"quantity": 1,
    			"returnPrice": 2000,
    			"item": {
    				"id": "7bc37782-683f-4cc8-b481-d800627bcb2f",
    				"created_at": "2024-01-22T15:38:57.187Z",
    				"updated_at": "2024-01-22T15:38:57.187Z",
    				"name": "Refined Plastic Sausages",
    				"price": 2000
    			}
    		}
    	]
    }
    ```

    - order :

    ```json
    {
    	"id": "ba7c1163-bf83-4e97-bf2f-e1856f5e3992",
    	"created_at": "2024-03-05T09:47:29.010Z",
    	"updated_at": "2024-03-05T09:47:29.010Z",
    	"name": "Kuhn - Howell",
    	"type": "order",
    	"targetId": "9201f5d2-a79e-46f5-9048-644efa3c79b7",
    	"invoiceNumber": "SB-RTN-20240305-002",
    	"returnItem": [
    		{
    			"id": "ecd26c35-6164-4874-bad9-1229f1dab186",
    			"created_at": "2024-03-05T09:47:29.010Z",
    			"updated_at": "2024-03-05T09:47:29.010Z",
    			"name": "Incredible Rubber Chair",
    			"quantity": 1,
    			"returnPrice": 750000,
    			"item": {
    				"id": "95b7dd21-33b4-426d-a730-b2e93b384825",
    				"created_at": "2024-01-22T15:38:46.935Z",
    				"updated_at": "2024-01-22T15:38:46.935Z",
    				"name": "Incredible Rubber Chair",
    				"price": 60000
    			}
    		}
    	]
    }
    ```
