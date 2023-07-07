const router = require('express').Router(); //import necessary modules
const { Category, Product } = require('../../models');
// The `/api/categories` endpoint
router.get('/', (req, res) => { //get request to retrieve all categories
  Category.findAll ({
    include: [
      {
        model: Product,
        attributes: [
          'id',
          'product_name',
          'price',
          'stock',
          'category_id'
        ]
      }
    ]
  })
  .then(categoryData => res.json(categoryData))
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })
 
});

router.get('/:id', (req, res) => { 
  // find one category by its `id` value
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Product,
        attributes: [
          'id',
          'product_name',
          'price',
          'stock',
          'category_id'
        ]
      }
    ]
  })
  .then(categoryData => {
    if (!categoryData) {
      res.status(404),json({message: 'This category ID does not exist'});
      return;
    }
    res.json(categoryData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
  
});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  })
  .then((tagData) => res.json(tagData))
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  })
});

router.put('/:id', (req, res) => {
  // update category by id
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(categoryData => {
    if (!categoryData[0]) {
      res.status(404).json({message: 'This category ID does not exist'});
      return;
    }
    res.json(categoryData);
  })
});

router.delete('/:id', (req, res) => {
  // delete category by id
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(categoryData => {
    if (!categoryData) {
      res.status(404).json({message: 'This category ID does not exist'});
      return;
    }
    res.json(categoryData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router; //export router
