<template>
  <div id="signup">
    <div class="register_box">
      <form id="submit_form" @submit.prevent="registUser">
        <!--회원가입 폼 작성 영역-->
        <div class="signMenu">
          <div class="title">회원가입</div>
          <div class="form-group row">
            <label for="register_id">아이디<span class="required" aria-required="true"></span></label>
            <div><input id="register_id" ref="register_id" v-model="register_id" class="login_input" type="text"
                        placeholder="등록하실 ID를 입력하십시오."></div>
          </div>
          <div class="form-group row">
            <label for="register_pwd">비밀번호<span class="required" aria-required="true"></span></label>
            <div><input id="register_pwd" ref="register_pwd" v-model="register_pwd" class="login_input" type="password"
                        autocomplete="on" placeholder="등록하실 비밀 번호를 입력해주세요.">
            </div>
          </div>
          <div class="form-group row">
            <label for="register_pwd_ck">비밀번호 확인<span class="required" aria-required="true"></span></label>
            <div><input id="register_pwd_ck" ref="register_pwd_ck" v-model="register_pwd_ck" class="login_input" type="password"
                        autocomplete="on" placeholder="입력하신 비밀 번호와 동일한 값을 입력하세요."></div>
          </div>
          <div class="form-group row">
            <label for="register_name">이름<span class="required" aria-required="true"></span></label>
            <div><input id="register_name" ref="register_name" v-model="register_name" class="login_input" type="text"
                        placeholder="이름을 입력하세요"></div>
          </div>
          <div class="form-group row">
            <label for="register_tel">전화번호<span class="required" aria-required="true"></span></label>
            <div><input id="register_tel" ref="register_tel" v-model="register_tel" class="login_input" type="text"
                        placeholder="전화번호를 입력해주세요."></div>
          </div>
          <div class="form-group row">
            <label for="register_role">유저권한<span class="required" aria-required="true"></span></label>
            <div class="form-group row">
              <select id="register_role" ref="register_role" v-model="register_role">
                <option value="1">관리자</option>
                <option value="2">유저</option>
              </select>
            </div>
          </div>
        </div>

        <!--이용약관 영역-->
        <div class="noticeMenu">
          <div class="title">이용약관<span class="required" aria-required="true"></span></div>
          <div><input class="tooltipster" id="agreement" ref="agreement" v-model="agreement" name="agreement" type="checkbox">
            <font size="3px">
              <label for="agreement">(주)에이스엔 이용약관 동의<font color="#dc143c">(필수)</font></label>
            </font>
          </div>
          <div>
                <textarea id="textarea1" readonly="readonly">㈜에이스엔 웹서버 서비스 이용자 약관

제 1조 (목적)
① 본 약관은 ㈜에이스엔(이하 '회사')가 제공하는 규정된서비스(이하 '서비스')의 이용조건 및 절차, 이용자와 당사의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
② 본 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법, 정보통신 윤리위원회 심의규정, 정보통신 윤리강령, 프로그램 보호법 및 기타관련 법령의 규정에 의합니다

제 2조 (용어의 정의)
① 이용자 : 본 약관에 따라 당사가 제공하는 서비스를 받는 자
② 웹서비스 : 회사가 운영하는 모든 악취, 통계자료, 모델링, 주민참여, CleanSYS, 수질TMS 종합상황판, 체취시스템, 측정시스템 등 이 있습니다.

제 3조 (서비스의 책임과 범위)
①   본 서비스에서 제공되는 시스템 정보와 세부정보는 해당 판매사의 고유 권한으로, 그 규칙은 해당 판매사의 규정을 따르게 됩니다.
②   회사가 운영하는 웹서비스에서는 회원가입이나 회원가입의 준비단계로서 어떠한 개인정보를 수집하지 않습니다.  공개적인 공간에 게재되는 개인정보로 인해 원하지 않는 상황이 발행할 수도 있습니다. 개인정보에 대한 비밀을 유지할 책임은 귀하에게 있으며, 당사는 개인정보 유출로 인해 발생한 결과에 대하여 어떤 책임도 부담하지 아니합니다.
③    이용자가 당사 서비스를 통하여 게시, 전송, 입수하였거나 전자메일 기타 다른 수단에 의하여 게시, 전송 또는 입수한 모든 형태의 정보에 대하여는 귀하가 모든 책임을 부담하며 당사는 어떠한 책임도 부담하지 아니합니다.
④    회사의 서비스에 보관되거나 전송된 메시지 및 기타 통신 메시지 등의 내용이 국가의 비상사태, 정전, 당사의 관리범위 외의 서비스 설비 장애 및 기타 불가항력에 의하여 보관되지 못하였거나 삭제된 경우, 전송되지 못한 경우 및 기타 통신 데이터의 손실이 있을 경우에 회사는 관련 책임을 부담하지 아니합니다.
⑤    회사는 사전 고지 후 서비스를 일시적으로 수정, 변경 및 중단할 수 있으며, 이에 대하여 귀하 또는 제3자에게 어떠한 책임도 부담하지 아니합니다.
⑥    당사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도 당사가 고의로 행한 범죄행위를 제외하고 이에 대하여 책임을 부담하지 아니합니다

제 4조 (약관의 효력성립과 변경)
① 회사는 귀하가 본 약관 내용에 동의하는 것을 조건으로 귀하에게 서비스를 제공할 것이며, 귀하가 본 약관의 내용에 동의하는 경우, 회사의 서비스 제공 행위 및 귀하의 서비스 사용 행위에는 본 약관이 우선적으로 적용될 것입니다.
② 회사는 본 약관을 사전 고지 없이 변경할 수 있으며, 변경된 약관은 회사가 운영하는 웹서비스 내에 공지함으로써 이용자가 직접 확인 하도록 할 것입니다. 이용자가 변경된 약관에 동의하지 아니하는 경우, 이용자는 신청하거나 구매한 서비스를 받으실 수 없으며, 계속 사용의 경우는 약관 변경에 대한 동의로 간주됩니다. 변경된 약관은 공지와 동시에 그 효력이 발생됩니다.

제 5조 (면책조항)
① 회사는 서비스에 표출된 어떠한 의견이나 정보에 대해 확신이나 대표할 의무가 없으며 이용자나 제3자에 의해 표출된 의견을 승인하거나 반대하거나 수정하지 않습니다. 이용자는 어떠한 경우라도 회원이 서비스에 담긴 정보에 의존해 잃은 이득이나 입은 해에 대해 책임이 없습니다.
② 당사는 이용자간 또는 이용자와 제3자간에 서비스를 매개로 정보 거래 혹은 금전적 거래 등과 관련하여 어떠한 책임도 부담하지 아니하고, 회원이 서비스의 이용과 관련하여 기대하는 이익에 관하여 책임을 부담하지 않습니다.

제 6조 (이용자 정보 사용에 대한 동의)
① 이용자의 개인정보에 대해서는 당사의 개인정보 보호정책이 적용됩니다.
② 회사의 웹서비스상 이용자 정보는 다음과 같이 수집, 사용, 관리, 보호됩니다.
(1) 개인정보의 수집 : 당사는 귀하의 당사 서비스 신청 시 귀하가 제공하는 정보 등을 통하여 귀하에 관한 정보를 수집합니다.
(2) 개인정보의 사용 : 회사는 서비스 제공과 관련해서 수집된 회원의 신상정보를 본인의 승낙 없이 제3자에게 누설, 배포하지 않습니다. 단, 전기통신기본법 등 법률의 규정에 의해 국가기관의 요구가 있는 경우, 범죄에 대한 수사상의 목적이 있거나 정보통신윤리 위원회의 요청이 있는 경우 또는 기타 관계법령에서 정한 절차에 따른 요청이 있는 경우, 귀하가 당사에 제공한 개인정보를 스스로 공개한 경우에는 그러하지 않습니다

제 7조 (정보 제공 및 광고의 게재)
① 회사는 서비스를 운영함에 있어서 각종 정보를 서비스에 게재하는 방법 등으로 회원에게 제공할 수 있습니다.
② 회사는 서비스에 적절하다고 판단되거나 활용 가능성 있는 회사 광고를 게재할 수 있습니다

제 8조 (당사의 의무)
① 회사는 법령과 본 약관이 금지하거나 미풍양속에 반하는 행위를 하지않으며, 계속적, 안정적으로 서비스를 제공하기 위해 노력할 의무가 있습니다.
② 회사는 특별한 사정이 없는 한 이용자가 신청한 서비스 제공 개시일에 서비스를 이용할 수 있도록 합니다.
③ 회사는 회원의 직접 입력하여 제공한 개인 신상 정보를 본인의 승낙 없이 타인에게 누설, 배포하여서는 아니 됩니다. 다만, 전기통신관련법령 등 관계법령에 의하여 관계 국가기관 등의 요구가 있는 경우에는 그러하지 아니합니다.
④ 회사는 이용자가 안전하게 당사서비스를 이용할 수 있도록 이용자의 개인정보 (신용정보 포함) 보호를 위한 자체 보안시스템을 갖추어야 하며, 아울러 익명의 다수 이용자가 접근할 수 있는 곳에 저장해서는 아니됩니다.
⑤ 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.

제 9조 (이용자의 의무)
① 이용자가 서비스요청을 위하여 작성하는 정보는 정확하게 기입하여야 합니다. 잘못 입력된 정보로 인한 어떠한 책임도 회사에게는 없습니다.
② 이용자는 당사의 사전 승낙 없이 서비스를 이용하여 어떠한 영리 행위도 할 수 없습니다.
③ 이용자는  당사 서비스를 이용하여 얻은 정보를 당사의 사전승낙 없이 복사, 복제, 변경, 번역, 출판·방송 기타의 방법으로 사용하거나 이를 타인에게 제공할 수 없습니다.
④ 이용자는 전기통신법 제53조와 전기통신사업법 시행령 16조(불온통신), 통신사업법 제53조3항에 위배되는 행위를 할 수 없습니다.

제 10조 (회사의 소유권)
① 회사가 제공하는 서비스, 및 웹서비스에 이용된 필요한 소프트웨어, 이미지, 마크, 로고, 디자인, 서비스명칭, 정보, 컨텐츠 및 상표 등과 관련된 지적재산권 및 기타 권리는 당사에게 소유권이 있습니다.
② 당사가 명시적으로 승인한 경우를 제외하고는 전항의 소정의 각 재산에 대한 전부 또는 일부의 수정, 대여, 대출, 판매, 배포, 제작, 양도, 재라이센스, 담보권 설정 행위, 상업적 이용 행위를 할 수 없으며, 제3자로 하여금 이와 같은 행위를 하도록 허락 할 수 없습니다.

제 11조 (관할법원)
본 서비스 이용과 관련하여 발생한 분쟁에 대해 소송이 제기될 경우 회사의 주소지가 속해 있는 지방법원을 전속적 관할 법원으로 합니다.

부 칙
1.  (시행일) 본 약관은 2020년 01월 01일부터 시행됩니다.
</textarea>
          </div>
        </div>

        <!--개인정보 처리 방침 영역-->
        <div class="noticeMenu">
          <div class="title">개인정보 처리 방침<span class="required" aria-required="true"></span></div>
          <div>
            <input class="tooltipstered" id="information" ref="information" v-model="information" name="information" type="checkbox">
            <font size="3px">
              <label for="information">(주)에이스엔 개인정보 처리 방침 동의<font color="#dc143c">(필수)</font></label>
            </font>
          </div>
          <div>
                <textarea id="textarea2" readonly="readonly">
<㈜에이스엔> 개인정보 처리방침

<(주)에이스엔>(은)는 개인정보 보호법 제30조에 따라 정보주체(고객)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립․공개합니다.

1. 개인정보의 처리목적 <(주)에이스엔>은(는) 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.
- 고객 가입의사 확인, 고객에 대한 서비스 제공에 따른 본인 식별․인증, 회원자격 유지․관리, 물품 또는 서비스 공급에 따른 금액 결제, 물품 또는 서비스의 공급․배송 등

2. 개인정보의 처리 및 보유기간 ① <(주)에이스엔>은(는) 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유․이용기간 또는 법령에 따른 개인정보 보유․이용기간 내에서 개인정보를 처리․보유합니다.
② 구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다.
- 고객 가입 및 관리 : 서비스 이용계약 또는 회원가입 해지시까지, 다만 채권․채무관계 잔존시에는 해당 채권․채무관계 정산시까지
- 전자상거래에서의 계약․청약철회, 대금결제, 재화 등 공급기록 : 5년

3. 개인정보의 제3자 제공 <(주)에이스엔>은(는) 정보주체의 별도 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우 외에는 개인정보를 제3자에게 제공하지 않습니다.

4. 개인정보처리의 위탁 ① <(주)에이스엔>은(는) 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 외부에 위탁하고 있습니다.
- DB 센터 운영
․위탁받는 자 (수탁자) : 해당 서비스 사용자 서버
․위탁하는 업무의 내용 : 고객 대상 제품 사용자 등록 DB 제공
② <(주)에이스엔>은(는) 위탁계약 체결시 개인정보 보호법 제25조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 재위탁 제한, 수탁자에 대한 관리․감독, 책임에 관한 사항을 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
5. 정보주체와 법정대리인의 권리․의무 및 행사방법 정보주체는 <(주)에이스엔>에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
1. 개인정보 열람요구
2. 개인정보에 오류 등이 있을 경우 정정 요구
3. 삭제요구
4. 처리정지 요구

6. 처리하는 개인정보 항목 <(주)에이스엔>은(는) 다음의 개인정보 항목을 처리하고 있습니다.
- 아이디, 비밀번호, 이름, 이메일, 전화번호, 회사명 등 회원가입 정보

7. 개인정보의 파기 ① <(주)에이스엔>은(는) 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
② <(주)에이스엔>은(는) 다음의 방법으로 개인정보를 파기합니다.
- 전자적 파일 : 파일 삭제 및 디스크 등 저장매체 포맷
- 수기(手記) 문서 : 분쇄하거나 소각

8. 개인정보의 안전성 확보조치 <(주)에이스엔>은(는) 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
- 관리적 조치 : 내부관리계획 수립․시행, 직원․종업원 등에 대한 정기적 교육
- 기술적 조치 : 개인정보처리시스템(또는 개인정보가 저장된 컴퓨터)의 비밀번호 설정 등 접근권한 관리, 백신소프트웨어 등 보안프로그램 설치, 개인정보가 저장된 파일의 암호화
- 물리적 조치 : 개인정보가 저장․보관된 장소의 시건, 출입통제 등

9. 개인정보 자동 수집 장치의 설치∙운영 및 거부에 관한 사항
① <(주)에이스엔>은(는) 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠기(cookie)’를 사용합니다.
② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
가. 쿠키의 사용목적: 이용자가 방문한 각 서비스와 웹 사이트들에
대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여
이용자에게 최적화된 정보 제공을 위해 사용됩니다.
나. 쿠키의 설치∙운영 및 거부 : 웹브라우저 상단의 도구>인터넷 옵션>개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다.
다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.

10. 개인정보 보호책임자 <(주)에이스엔>은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
▶ 개인정보 보호책임자 (대표자)
성명 : 송희남 직책 : 대표이사
연락처 : <070-8220-3865>

11. 개인정보 처리방침 변경 이 개인정보 처리방침은 2020. 1. 1.부터 적용됩니다.
                </textarea>
          </div>
        </div>

        <!--회원가입 폼 버튼 영역-->
        <div class="buttonArea">
          <button class="signupButton" type="button" v-on:click="registUser">회원가입</button>
          <button class="cancelButton" type="button" v-on:click="cancelBtn">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      register_id: "",
      register_pwd: "",
      register_pwd_ck: "",
      register_name: null,
      register_tel: null,
      register_role: null,
      agreement: false,
      information: false
    }
  },
  methods: {
    /*form 체크 함수*/
    validationCk() {
      this.errors = [];
      if (this.register_id == null) {
        this.errors.push("아이디를 입력하셔야 합니다.");
        this.$refs.register_id.focus();
      }
      if (this.register_pwd != this.register_pwd_ck) {
        this.errors.push("패스워드 확인이 일치하지 않습니다. 다시 입력해주세요.");
        this.$refs.register_pwd_ck.focus();
      }
      if (this.register_name == null) {
        this.errors.push("이름을 입력하셔야 합니다.");
        this.$refs.register_name.focus();
      }
      if (this.register_tel == null) {
        this.errors.push("전화 번호를 입력해 주세요.");
        this.$refs.register_tel.focus();
      }
      if (this.register_role == null) {
        this.errors.push("유저 권한을 선택하여야 합니다.");
        this.$refs.register_role.focus();
      }
      if (this.agreement == false){
        this.errors.push('이용약관에 동의를 하셔야 합니다.');
        this.$refs.agreement.focus();
      }
      if(this.information == false) {
        this.errors.push('개인 처리 방침에 동의를 하셔야 합니다.');
        this.$refs.information.focus();
      }
      return this.errors;
    },
    registUser: function() {
      this.validationCk();
      if (this.errors.length == 0) {
        this.$store.dispatch('REGISTER',{
          register_id: this.register_id,
          register_pwd: this.register_pwd,
          register_name: this.register_name,
          register_tel: this.register_tel,
          register_role: this.register_role
          })
          .then(success => {
            this.$router.push("/");
          })
      } else {
        for(let i in this.errors) alert(this.errors[i])
      }
    },
    cancelBtn: function () {
      if (confirm("로그인 화면으로 돌아가시겠습니까?")) {
        this.$router.push("/");
      } else {
        alert("취소되었습니다.")
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/style/member/signup';
</style>
