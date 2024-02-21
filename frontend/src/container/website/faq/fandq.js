import React,{ useEffect }  from "react";
import "./fandq.css";
import Accordion from "react-bootstrap/Accordion";
import { Link } from "react-router-dom";
const Fandq = () => {

  return (
    <div id="fandq" className="faq_area">
      <div className="container animate__animated wow animate__fadeInRight">
        <h2 className="fandq">سوالات متداول</h2>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>چگونه وارد محیط برنامه شویم؟</Accordion.Header>
            <Accordion.Body>
              جهت استفاده از برنامه در قسمت ابتدایی وبسایت با کلیک بر روی «نسخه وب‌اپلیکیشن» می‌توانید وارد صفحه مربوط به ورود شوید.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>آیا این برنامه رایگان است؟</Accordion.Header>
            <Accordion.Body>
            در حال حاضر برنامه ما برای استفاده عموم به صورت رایگان می‌باشد. اما در آبنده می‌توانید از ویژگی‌های اضافی و پیشرفته سیستم با خرید اشتراکات پولی استفاده نمایید .
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>جهت ثبت‌نام در این سیستم به چه اطلاعاتی نیاز است؟</Accordion.Header>
            <Accordion.Body>
              جهت ثبت‌نام در این  سیستم تنها نیاز به چند مورد محدود از اطلاعات می‌باشید. این اطلاعات شامل نام و نام‌خانوادگی، آدرس الکترونیکی و تلفن همراه بوده و سپس با انتخاب نام کاربری و رمز عبور ثبت‌نام شما تکمیل می‌گردد.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>آیا این برنامه روی تمام سیستم‌عامل‌ها قابل استفاده است؟</Accordion.Header>
            <Accordion.Body>
            برنامه به صورت وب‌اپلیکیشن طراحی شده است و ب همین علت در انواع سیستم‌عامل ها قابل استفاده می‌باشد.در صورت تمایل به استفاده از برنامه در محیط‌های تلفن همراه می‌توانید از گزینه «اضافه کردن به صفحه اصلی»  از برنامه به صورت مستقیم استفاده کنید.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>آیا امکان بازیابی رمز عبور وجود دارد؟</Accordion.Header>
            <Accordion.Body>
            بله، شما می‌توانید با استفاده از گزینه "فراموشی رمز عبور" در صفحه ورود، و یا تعویض رمز عبور از قسمت نمایه شخصی،رمز عبور خود را بازیابی کنید.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5">
            <Accordion.Header>امکانات این سیستم شامل چه مواردی می‌باشد؟</Accordion.Header>
            <Accordion.Body>
              در قسمت «معرفی برنامه» در وب‌سایت اصلی می‌توانیدامکانات اصلی برنامه را مشاهده نمایید.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};

export default Fandq;
