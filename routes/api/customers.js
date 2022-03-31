const express = require('express')
const router = express.Router()
const { Customer, customerValidator } = require('../../db/models/Customer')
const validId = require('../../middleware/validId')
const validateData = require('../../middleware/validateData')

router.get('/', async (req, res) => {
	const customers = await Customer.find({}).sort('name')
	res.send(customers)
})

router.get('/:id', validId, async (req, res) => {
	const id = req.params.id
	const customer = await Customer.findById(id)
	if (!customer) {
		return res.status(404).send(`Cannot find customer with id ${id}`)
	}
	res.send(customer)
})

router.post('/', validateData(customerValidator), async (req, res) => {
	const data = req.body
	const newCustomer = new Customer(data)
	await newCustomer.save()
	res.send(newCustomer)
})

router.put(
	'/:id',
	[validId, validateData(customerValidator)],
	async (req, res) => {
		const id = req.params.id
		const data = req.body
		const updatedCustomer = await Customer.findByIdAndUpdate(id, data, {
			new: true
		})
		if (!updatedCustomer) {
			return res.status(404).send(`Could not update customer with id ${id}.`)
		}
		res.send(updatedCustomer)
	}
)

router.delete('/:id', validId, async (req, res) => {
	const id = req.params.id
	const deletedCustomer = await Customer.findByIdAndDelete(id)
	if (!deletedCustomer) {
		return res.status(404).send(`Could not delete customer with id ${id}.`)
	}
	res.send(deletedCustomer)
})

module.exports = router
