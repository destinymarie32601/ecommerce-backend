const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

//api/tags endpoint 
router.get('/', (req, res) => {
  // get all tags
  Tag.findAll({
    include: [
      {
        model: Product,
        attributes: [
          'product_name',
          'price',
          'stock',
          'category_id'
        ]
      }
    ]
  })
  .then(tagData => res.json(tagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.get('/:id', (req, res) => {
  // get tag by id
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Product,
        attributes: [
          'product_name',
          'price',
          'stock',
          'category_id'
        ]
      }
    ]
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then((tagData) => res.json(tagData))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(tagData => {
    if (!tagData) {
      res.status(404).json({message: 'This tag ID does not exist'});
      return;
    }
    res.json(tagData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(tagData => {
    if (!tagData) {
      res.status(404).json({ message: 'This tag ID does not exist'});
      return;
    }
    res.json(tagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
