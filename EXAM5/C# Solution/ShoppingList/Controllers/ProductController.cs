using System.Linq;
using System.Web.Mvc;
using ShoppingList.Models;

namespace ShoppingList.Controllers
{
    [ValidateInput(false)]
    public class ProductController : Controller
    {
        private ShoppingListDbContext db = new ShoppingListDbContext();
        [HttpGet]
        [Route("")]
        public ActionResult Index()
        {
            var products = db.Products.ToList();
            return View(products);
        }

        [HttpGet]
        [Route("create")]
        public ActionResult Create()
        {
            return View(new Product());
        }

        [HttpPost]
        [Route("create")]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Product product)
        {
            if (this.ModelState.IsValid)
            {
                db.Products.Add(product);
                db.SaveChanges();
                return Redirect("/");
            }

            return View(product);
        }

        [HttpGet]
        [Route("edit/{id}")]
        public ActionResult Edit(int? id)
        {
            var product = db.Products.Find(id);
            if (product == null)
                return HttpNotFound();

            return View(product);
        }

        [HttpPost]
        [Route("edit/{id}")]
        [ValidateAntiForgeryToken]
        public ActionResult EditConfirm(int? id, Product productModel)
        {
            var productFormDB = db.Products.Find(id);
            if (productFormDB == null)
                return HttpNotFound();

            if (this.ModelState.IsValid)
            {
                productFormDB.Name = productModel.Name;
                productFormDB.Priority = productModel.Priority;
                productFormDB.Status = productModel.Status;
                productFormDB.Quantity = productModel.Quantity;

                db.SaveChanges();

                return Redirect("/");
            }

            return View("Edit", productModel);
        }
    }
}