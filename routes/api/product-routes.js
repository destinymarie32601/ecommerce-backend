const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// /api/products endpoint

// get all products
router.get('/', (req, res) => {
  
  Product.findAll({
    attributes: [
      'id',
      'product_name',
      'price',
      'stock'
    ],
    include: [
      {
        model: Category,
        attributes: [
          'id',
          'category_name'
        ]
      },
      {
        model: Tag,
        attributes: [
          'id',
          'tag_name'
        ]
      } 
    ]
  })
  .then(productData => res.json(productData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// get one product by id
router.get('/:id', (req, res) => {
  
  Product.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'product_name',
      'price',
      'stock'
    ],
    include: [
      {
        model: Category,
        attributes: [
          'id',
          'category_name'
        ]
      },
      {
        model: Tag,
        attributes: [
          'id',
          'tag_name'
        ]
      }
    ]
  })
  .then(productData => {
    if (!productData) {
      res.status(404).json({message: 'This product ID does not exist'});
      return;
    }
    res.json(productData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// create new product
router.post('/', (req, res) => {
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    tagIds: req.body.tag_id
  })
  .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(201).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product by id
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(ProductData => {
    if (!ProductData) {
      res.status(404).json({message: 'This product ID does not exist'});
      return;
    }
    res.json(ProductData);
  })
  .catch(err => {
    console.log(err);
  })
  // delete one product by its `id` value
});

module.exports = router;
