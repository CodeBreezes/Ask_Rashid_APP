import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Texts from "../../components/Texts";

const AuthLoadingScreen = () => {
  const navigation = useNavigation();
  const [modalKey, setModalKey] = useState(0);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  const [showTerms, setShowTerms] = useState(false);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const termsAccepted = await AsyncStorage.getItem("termsAccepted");
      debugger;
      if (termsAccepted !== "true") {
        setShowTerms(true);
        setLoading(false);
        return;
      }

      checkAuth();
    } catch (error) {
      console.error("Auth loading error:", error);
      navigation.replace("Login");
    }
  };

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      navigation.replace("Dashboard");
    } else {
      navigation.replace("Login");
    }
  };

  const acceptTerms = async () => {
    await AsyncStorage.setItem("termsAccepted", "true");
    setShowTerms(false);
    checkAuth();
  };

  const cancelTerms = () => {
    Alert.alert(
      "Terms Required",
      "You must accept the terms to continue using the app.",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => navigation.replace("Home"),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  return (
    <>
      {/* Loader stays behind modal */}
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>

      {/* TERMS MODAL */}
      <Modal
        visible={showTerms}
        animationType="slide"
        transparent
        statusBarTranslucent
        onShow={() => {
          setLanguage("en");

          if (!hasRefreshed) {
            setHasRefreshed(true);
            setTimeout(() => {
              setModalKey(prev => prev + 1);
            }, 0);
          }
        }}
      >


        <View style={styles.overlay}>
          <View key={modalKey} style={styles.modalBox}>


            {/* Language Switch */}
            <View style={styles.langSwitch}>
              <TouchableOpacity
                style={[styles.langBtn, language === "en" && styles.activeLang]}
                onPress={() => setLanguage("en")}
              >
                <Texts style={styles.langText}>English</Texts>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.langBtn, language === "ar" && styles.activeLang]}
                onPress={() => setLanguage("ar")}
              >
                <Texts style={styles.langText}>العربية</Texts>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

              {/* ================= ARABIC TERMS ================= */}
              {language === "ar" && (
                <>
                  <Texts style={[styles.title, styles.rtl]}>اتفاقية الشروط والأحكام لتطبيق اسأل راشد</Texts>

                  <Texts style={[styles.heading, styles.rtl]}>1. قبول الشروط والأحكام</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    بتحميلك أو تثبيتك أو تسجيلك في تطبيق "اسأل راشد" للهواتف المحمولة ("التطبيق")، فإنك ("المستخدم" أو "أنت") تقر بأنك قد قرأت وفهمت وتوافق على الالتزام قانونياً بهذه الشروط والأحكام. إذا لم توافق على أي جزء من هذه الشروط، يجب عليك التوقف فوراً عن استخدام التطبيق وإزالته من جهازك.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>2. وصف الخدمة</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    "اسأل راشد" هو منصة رقمية يديرها راشد باحطّاب ("اسأل راشد") تقدم خدمات الإرشاد التحفيزي، والتوجيه الحياتي، والإرشاد التطويري الشخصي من خلال جلسات فيديو مباشرة مجدولة. يسهل التطبيق حجز الدفع للجلسات الفردية، والندوات الجماعية، والمشاركة في الفعاليات، وفرص مشاركة القصص.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>3. إخلاء المسؤولية: طبيعة الخدمات</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    إشعار هام: راشد باحطّاب ليس معالجاً نفسياً مرخصاً، أو طبيباً نفسياً، أو طبيباً، أو مستشاراً مرخصاً. راشد هو مؤثر على وسائل التواصل الاجتماعي ومتحدث تحفيزي يشارك رؤى مستندة إلى تجاربه الشخصية، وملاحظاته، وقصص واقعية يشاركها مجتمعه. يركز محتواه على التحديات الحياتية الشائعة، وتحديات مكان العمل، والنمو الشخصي، والمواضيع الثقافية بشكل رئيسي عبر منصات تيك توك، إنستغرام، ويوتيوب.
                  </Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    الخدمات المقدمة من خلال "اسأل راشد" هي لأغراض تحفيزية وتعليمية وتطوير شخصي فقط. لا تشكل نصائح طبية، أو علاجاً نفسياً، أو استشارات إكلينيكية، أو علاجاً نفسياً. إذا كنت تعاني من مشاكل صحية نفسية، أو ضغوط عاطفية، أو حالات طبية، يجب عليك طلب المساعدة من المتخصصين الصحيين المؤهلين.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>4. أهلية المستخدم</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    يجب أن يكون عمرك 14 سنة على الأقل للتسجيل واستخدام التطبيق. بإنشائك لحساب، فإنك تؤكد أنك تستوفي هذا الشرط العمري. يجب أن يكون لدى المستخدمين الذين تقل أعمارهم عن 18 عاماً وعي الوالدين باستخدامهم لهذه الخدمة.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>5. تسجيل الحساب والأمان</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    توافق على تقديم معلومات دقيقة وحديثة وكاملة أثناء التسجيل. أنت المسؤول الوحيد عن الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك وعن جميع الأنشطة التي تتم تحت حسابك. يرجى إبلاغنا فوراً بأي وصول غير مصرح به للحساب.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>6. شروط الدفع</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    • تتطلب جميع حجوزات الجلسات الدفع الكامل مسبقاً.
                    {"\n"}• تتم معالجة المدفوعات بأمان من خلال معالجات دفع تابعة لجهات خارجية.
                    {"\n"}• لا يخزن التطبيق تفاصيل بطاقة الدفع الكاملة الخاصة بك.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>7. سياسة الاسترداد</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    جميع المدفوعات التي تتم عبر تطبيق "اسأل راشد" نهائية ولا يمكن استردادها، باستثناء الحالة التالية:
                  </Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    استثناء الاسترداد: إذا ألغى راشد باحطّاب جلسة لأي سبب، فسيحصل المستخدمون على استرداد كامل للمبلغ المدفوع لتلك الجلسة المحددة. ستتم معالجة عمليات الاسترداد إلى طريقة الدفع الأصلية خلال 7-10 أيام عمل.
                  </Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    لن يتم إصدار أي مبالغ مستردة تحت أي ظروف أخرى، بما في ذلك على سبيل المثال لا الحصر:
                    {"\n"}• إلغاء المستخدم أو عدم حضوره
                    {"\n"}• مشاكل تقنية على جانب المستخدم
                    {"\n"}• عدم الرضا عن محتوى الجلسة أو نتائجها
                    {"\n"}• تغيير الظروف الشخصية أو القرارات
                    {"\n"}• الجلسات المعاد جدولتها
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>8. سياسة إعادة الجدولة</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    يمكن للمستخدمين إعادة جدولة الجلسات المحجوزة عن طريق تقديم إشعار مسبق 24 ساعة على الأقل عبر نموذج "اتصل بنا" داخل التطبيق. يمكن إعادة جدولة الجلسات مرة واحدة فقط لكل حجز. سيؤدي الفشل في تقديم الإشعار في الوقت المناسب إلى فقدان الجلسة دون استرداد.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>9. سلوك المستخدم والمسؤوليات</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    أنت توافق على:
                    {"\n"}• الحفاظ على تواصل محترم ومناسب خلال جميع التفاعلات
                    {"\n"}• عدم تسجيل أو التقاط لقطات شاشة أو توزيع محتوى الجلسة دون إذن كتابي صريح
                    {"\n"}• تقديم معلومات صادقة وعدم التحريف عن هويتك أو عمرك
                    {"\n"}• استخدام الخدمة لأغراض قانونية فقط
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>10. حقوق الملكية الفكرية</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    جميع المحتويات والمنهجيات والمواد المعروضة أثناء الجلسات تبقى ملكية فكرية لراشد باحطّاب. تحصل على ترخيص محدود وغير قابل للتحويل للاستخدام الشخصي فقط.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>11. حدود المسؤولية</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    إلى أقصى حد يسمح به القانون، فإن "اسأل راشد"، وراشد باحطّاب، والجهات التابعة لهم، لن يكونوا مسؤولين عن أي أضرار غير مباشرة، أو عرضية، أو خاصة، أو تبعية، أو عقابية تنشأ عن استخدامك للخدمة. ولا تتجاوز المسؤولية الإجمالية لأي مطالبة المبلغ المدفوع للجلسة المحددة المعنية.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>12. إخلاء مسؤولية الضمانات</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    تقدم الخدمة "كما هي" و"كما هي متاحة" بدون أي ضمانات من أي نوع. لا نضمن نتائج محددة، أو مخرجات، أو تحولات شخصية من استخدام خدماتنا.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>13. إنهاء الحساب</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    نحتفظ بالحق في تعليق أو إنهاء حسابك وفقاً لتقديرنا الخاص لانتهاك هذه الشروط، أو السلوك المسيء، أو أي سبب معقول آخر.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>14. تعديلات الشروط</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    قد نقوم بتحديث هذه الشروط بشكل دوري. يشكل الاستمرار في استخدام التطبيق بعد التغييرات موافقة على الشروط المعدلة. يتحمل المستخدمون مسؤولية مراجعة الشروط بانتظام.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>15. القانون الحاكم</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    تخضع هذه الشروط وتحكم وفقاً للقوانين المعمول بها. يجب معالجة أي نزاعات أولاً من خلال التفاوض بحسن نية.
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>16. معلومات الاتصال</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    للاستفسارات أو الدعم:
                    {"\n"}• استخدم نموذج "اتصل بنا" داخل التطبيق
                    {"\n"}• البريد الإلكتروني: info@rashidbahattab.com
                    {"\n"}• وقت الاستجابة: 3-5 أيام عمل
                  </Texts>

                  <Texts style={[styles.heading, styles.rtl]}>الإقرار النهائي</Texts>
                  <Texts style={[styles.text, styles.rtl]}>
                    بمتابعتك، فإنك تؤكد أن:
                    {"\n"}1. عمرك 14 سنة على الأقل وتستوفي الشرط العمري.
                    {"\n"}2. لقد قرأت وفهمت هذه الشروط والأحكام بالكامل.
                    {"\n"}3. تعترف بأن راشد باحطّاب يقدم إرشاداً تحفيزياً، وليس علاجاً طبياً أو نفسياً.
                    {"\n"}4. تقبل سياسة الاسترداد.
                    {"\n"}5. تطلب هذه الخدمة طواعية لأغراض التطوير الشخصي.
                  </Texts>
                </>
              )}

              {/* ================= ENGLISH TERMS ================= */}
              {language === "en" && (
                <>
                  <Texts style={styles.title}>TERMS AND CONDITIONS AGREEMENT FOR ASK RASHID</Texts>

                  <Texts style={styles.heading}>1. Acceptance of Terms</Texts>
                  <Texts style={styles.text}>
                    By downloading, installing, and registering for the Ask Rashid mobile application ("the App"), you ("User," "you," or "your") acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions. If you do not agree with any part of these terms, you must immediately cease using the App and uninstall it from your device.
                  </Texts>

                  <Texts style={styles.heading}>2. Service Description</Texts>
                  <Texts style={styles.text}>
                    Ask Rashid is a digital platform operated by Rashid Bahattab ("Rashid") that provides motivational speaking, lifestyle coaching, and personal development guidance through scheduled live video sessions. The App facilitates booking and payment for one-on-one sessions, group webinars, event speaking engagements, and story-sharing opportunities.
                  </Texts>

                  <Texts style={styles.heading}>3. Disclaimer: Nature of Services</Texts>
                  <Texts style={styles.text}>
                    CRITICAL NOTICE: Rashid Bahattab is NOT a licensed therapist, psychologist, psychiatrist, medical doctor, or certified counsellor. Rashid is a social media influencer and motivational speaker who shares insights based on personal experiences, observations, and real-life stories shared by his community. His content addresses common life struggles, workplace challenges, personal growth, and cultural topics predominantly through TikTok, Instagram and YouTube platforms.
                  </Texts>
                  <Texts style={styles.text}>
                    The services provided through Ask Rashid are strictly for motivational, educational, and personal development purposes only. They do NOT constitute medical advice, psychological therapy, clinical counselling, or psychiatric treatment. If you are experiencing mental health issues, emotional distress, or medical conditions, you must seek assistance from qualified healthcare professionals.
                  </Texts>

                  <Texts style={styles.heading}>4. User Eligibility</Texts>
                  <Texts style={styles.text}>
                    You must be at least 14 years old to register and use the App. By creating an account, you confirm that you meet this age requirement. Users under 18 should have parental awareness of their use of this service.
                  </Texts>

                  <Texts style={styles.heading}>5. Account Registration and Security</Texts>
                  <Texts style={styles.text}>
                    You agree to provide accurate, current, and complete information during registration. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities under your account. Promptly notify us of any unauthorized account access.
                  </Texts>

                  <Texts style={styles.heading}>6. Payment Terms</Texts>
                  <Texts style={styles.text}>
                    • All session bookings require full payment in advance.
                    {"\n"}• Payments are processed securely through third-party payment processors.
                    {"\n"}• The App does not store your complete payment card details.
                  </Texts>

                  <Texts style={styles.heading}>7. REFUND POLICY</Texts>
                  <Texts style={styles.text}>
                    ALL PAYMENTS MADE THROUGH THE ASK RASHID APP ARE FINAL AND NON-REFUNDABLE, except in the following specific case:
                  </Texts>
                  <Texts style={styles.text}>
                    Refund Exception: If Rashid Bahattab cancels a session for any reason, users will receive a full refund of the amount paid for that specific session. Refunds will be processed to the original payment method within 7-10 business days.
                  </Texts>
                  <Texts style={styles.text}>
                    No refunds will be issued under any other circumstances, including but not limited to:
                    {"\n"}• User cancellation or failure to attend
                    {"\n"}• Technical issues on the User's side
                    {"\n"}• Dissatisfaction with session content or outcomes
                    {"\n"}• Change of personal circumstances or decisions
                    {"\n"}• Rescheduled sessions
                  </Texts>

                  <Texts style={styles.heading}>8. Rescheduling Policy</Texts>
                  <Texts style={styles.text}>
                    Users may reschedule booked sessions by providing at least 24 hours advance notice through the in-app "Contact Us" form. Sessions can be rescheduled only once per booking. Failure to provide timely notice will result in forfeiture of the session without refund.
                  </Texts>

                  <Texts style={styles.heading}>9. User Conduct and Responsibilities</Texts>
                  <Texts style={styles.text}>
                    You agree to:
                    {"\n"}• Maintain respectful and appropriate communication during all interactions
                    {"\n"}• Not record, screenshot, or distribute session content without explicit written permission
                    {"\n"}• Provide truthful information and not misrepresent your identity or age
                    {"\n"}• Use the service for lawful purposes only
                  </Texts>

                  <Texts style={styles.heading}>10. Intellectual Property Rights</Texts>
                  <Texts style={styles.text}>
                    All content, methodologies, and materials presented during sessions remain the intellectual property of Rashid Bahattab. You receive a limited, non-transferable license for personal use only.
                  </Texts>

                  <Texts style={styles.heading}>11. Limitation of Liability</Texts>
                  <Texts style={styles.text}>
                    To the maximum extent permitted by law, Ask Rashid, Rashid Bahattab, and their affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. Total liability for any claim shall not exceed the amount paid for the specific session in question.
                  </Texts>

                  <Texts style={styles.heading}>12. Disclaimer of Warranties</Texts>
                  <Texts style={styles.text}>
                    The service is provided "as is" and "as available" without warranties of any kind. We do not guarantee specific outcomes, results, or personal transformations from using our services.
                  </Texts>

                  <Texts style={styles.heading}>13. Account Termination</Texts>
                  <Texts style={styles.text}>
                    We reserve the right to suspend or terminate your account at our sole discretion for violations of these Terms, abusive behavior, or any other reasonable cause.
                  </Texts>

                  <Texts style={styles.heading}>14. Modifications to Terms</Texts>
                  <Texts style={styles.text}>
                    We may update these Terms periodically. Continued use of the App after changes constitutes acceptance of the modified Terms. Users are responsible for reviewing Terms regularly.
                  </Texts>

                  <Texts style={styles.heading}>15. Governing Law</Texts>
                  <Texts style={styles.text}>
                    These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall first be addressed through good-faith negotiation.
                  </Texts>

                  <Texts style={styles.heading}>16. Contact Information</Texts>
                  <Texts style={styles.text}>
                    For inquiries or support:
                    {"\n"}• Use the in-app "Contact Us" form
                    {"\n"}• Email: info@rashidbahattab.com
                    {"\n"}• Response Time: 3-5 business days
                  </Texts>

                  <Texts style={styles.heading}>FINAL ACKNOWLEDGMENT</Texts>
                  <Texts style={styles.text}>
                    By proceeding, you confirm that:
                    {"\n"}1. You are at least 14 years old and meet the age requirement.
                    {"\n"}2. You have read and understood these Terms and Conditions in their entirety.
                    {"\n"}3. You acknowledge that Rashid Bahattab provides motivational guidance, not medical or psychological treatment.
                    {"\n"}4. You accept the refund policy.
                    {"\n"}5. You are voluntarily seeking this service for personal development purposes.
                  </Texts>
                </>
              )}

            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.button, styles.acceptBtn]} onPress={acceptTerms}>
                <Texts style={styles.btnText}>{language === "en" ? "ACCEPT TERMS" : "قبول الشروط"}</Texts>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={cancelTerms}>
                <Texts style={styles.btnText}>{language === "en" ? "DECLINE TERMS" : "رفض الشروط"}</Texts>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </>
  );
};

export default AuthLoadingScreen;
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: { flex: 1, backgroundColor: "rgba(173, 159, 159, 0.5)", justifyContent: "center", padding: 16 },
  modalBox: { backgroundColor: "#fff", borderRadius: 12, padding: 16, maxHeight: "85%" },
  langSwitch: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  langBtn: { borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 18, paddingVertical: 6, marginHorizontal: 5 },
  activeLang: { backgroundColor: "#6A5ACD" },
  langText: { fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 15 },
  heading: { fontSize: 16, fontWeight: "600", marginTop: 14 },
  text: { fontSize: 14, marginTop: 6, lineHeight: 20, color: "#444" },
  buttons: { marginTop: 16 },
  button: { paddingVertical: 14, borderRadius: 6, alignItems: "center", marginBottom: 10 },
  acceptBtn: { backgroundColor: "#28a745" },
  cancelBtn: { backgroundColor: "#dc3545" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
