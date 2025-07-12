// In-memory products storage for development
let products = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    description: 'Comfortable and stylish cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.',
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: 'men-shirts',
    subcategory: 't-shirts',
    brand: 'CityStore',
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 }
    ],
    colors: [
      {
        color: 'White',
        colorCode: '#FFFFFF',
        images: ['white-tshirt-1.jpg', 'white-tshirt-2.jpg']
      },
      {
        color: 'Black',
        colorCode: '#000000',
        images: ['black-tshirt-1.jpg', 'black-tshirt-2.jpg']
      },
      {
        color: 'Navy',
        colorCode: '#001f3f',
        images: ['navy-tshirt-1.jpg', 'navy-tshirt-2.jpg']
      }
    ],
    images: [
      { url: 'tshirt-main.jpg', alt: 'Classic Cotton T-Shirt', isPrimary: true },
      { url: 'tshirt-side.jpg', alt: 'T-Shirt Side View', isPrimary: false },
      { url: 'tshirt-back.jpg', alt: 'T-Shirt Back View', isPrimary: false }
    ],
    features: ['100% Organic Cotton', 'Machine Washable', 'Comfortable Fit'],
    materials: ['Organic Cotton'],
    careInstructions: ['Machine wash cold', 'Tumble dry low', 'Do not bleach'],
    rating: { average: 4.5, count: 24 },
    reviews: [],
    totalStock: 45,
    isActive: true,
    isFeatured: true,
    tags: ['cotton', 'casual', 'basic', 'comfortable'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Elegant Summer Dress',
    description: 'Beautiful floral summer dress perfect for warm weather. Lightweight and breathable fabric.',
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    category: 'women-dresses',
    subcategory: 'summer-dresses',
    brand: 'CityStore',
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 8 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 6 },
      { size: 'XL', stock: 4 }
    ],
    colors: [
      {
        color: 'Floral Blue',
        colorCode: '#4169E1',
        images: ['blue-dress-1.jpg', 'blue-dress-2.jpg']
      },
      {
        color: 'Floral Pink',
        colorCode: '#FFB6C1',
        images: ['pink-dress-1.jpg', 'pink-dress-2.jpg']
      }
    ],
    images: [
      { url: 'dress-main.jpg', alt: 'Elegant Summer Dress', isPrimary: true },
      { url: 'dress-detail.jpg', alt: 'Dress Detail View', isPrimary: false }
    ],
    features: ['Lightweight Fabric', 'Floral Print', 'Midi Length'],
    materials: ['Polyester', 'Cotton Blend'],
    careInstructions: ['Hand wash recommended', 'Hang to dry', 'Iron on low heat'],
    rating: { average: 4.8, count: 18 },
    reviews: [],
    totalStock: 33,
    isActive: true,
    isFeatured: true,
    tags: ['dress', 'summer', 'floral', 'elegant'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Premium Denim Jeans',
    description: 'High-quality denim jeans with a modern slim fit. Durable and comfortable for all-day wear.',
    price: 89.99,
    originalPrice: 89.99,
    discount: 0,
    category: 'men-pants',
    subcategory: 'jeans',
    brand: 'CityStore',
    sizes: [
      { size: '30', stock: 6 },
      { size: '32', stock: 12 },
      { size: '34', stock: 15 },
      { size: '36', stock: 10 },
      { size: '38', stock: 7 }
    ],
    colors: [
      {
        color: 'Dark Blue',
        colorCode: '#191970',
        images: ['dark-jeans-1.jpg', 'dark-jeans-2.jpg']
      },
      {
        color: 'Light Blue',
        colorCode: '#ADD8E6',
        images: ['light-jeans-1.jpg', 'light-jeans-2.jpg']
      }
    ],
    images: [
      { url: 'jeans-main.jpg', alt: 'Premium Denim Jeans', isPrimary: true },
      { url: 'jeans-detail.jpg', alt: 'Jeans Detail View', isPrimary: false }
    ],
    features: ['Premium Denim', 'Slim Fit', '5-Pocket Design'],
    materials: ['98% Cotton', '2% Elastane'],
    careInstructions: ['Machine wash cold', 'Turn inside out', 'Tumble dry medium'],
    rating: { average: 4.3, count: 31 },
    reviews: [],
    totalStock: 50,
    isActive: true,
    isFeatured: false,
    tags: ['jeans', 'denim', 'casual', 'slim-fit'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      size,
      color,
      sort,
      page = 1,
      limit = 12,
      search
    } = req.query;

    let filteredProducts = [...products];

    // Filter by search term
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Filter by brand
    if (brand) {
      filteredProducts = filteredProducts.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
    }

    // Filter by price range
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Filter by size
    if (size) {
      filteredProducts = filteredProducts.filter(product =>
        product.sizes.some(s => s.size === size && s.stock > 0)
      );
    }

    // Filter by color
    if (color) {
      filteredProducts = filteredProducts.filter(product =>
        product.colors.some(c => c.color.toLowerCase().includes(color.toLowerCase()))
      );
    }

    // Sort products
    if (sort) {
      switch (sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating.average - a.rating.average);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: paginatedProducts.length,
      total: filteredProducts.length,
      page: parseInt(page),
      pages: Math.ceil(filteredProducts.length / limit),
      data: paginatedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const newProduct = {
      id: (products.length + 1).toString(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (newProduct.sizes && newProduct.sizes.length > 0) {
      newProduct.totalStock = newProduct.sizes.reduce((total, size) => total + size.stock, 0);
    }

    products.push(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      updatedAt: new Date()
    };

    if (updatedProduct.sizes && updatedProduct.sizes.length > 0) {
      updatedProduct.totalStock = updatedProduct.sizes.reduce((total, size) => total + size.stock, 0);
    }

    products[productIndex] = updatedProduct;

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    products.splice(productIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = products.filter(product => product.isFeatured && product.isActive);

    res.status(200).json({
      success: true,
      count: featuredProducts.length,
      data: featuredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

