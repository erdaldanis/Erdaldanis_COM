using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }
        public ActionResult EgitimBilgileri()
        {
            
            return View();
        }
        public ActionResult Sertifikalar()
        {
            return View();
        }
        public ActionResult Referanslar()
        {
            
            
            return View();
        }
        public ActionResult Kariyer()
        {
            return View();
        }
        public ActionResult Yetkinlikler()
        {
            return View(); 
        }
        public ActionResult Hakkımda()
        {
            return View();
        }
        public ActionResult Gezdigimiller()
        {
            return View();
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }
    }
}