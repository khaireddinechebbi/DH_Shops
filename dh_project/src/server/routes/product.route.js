import { Router } from 'express';
import { 
    getProduct, 
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImages
} from '../controllers/product.controller.js'

const router = Router();

router.get('/', getProduct);
router.post('/', createProduct, uploadProductImages);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
