// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import mustache from "shared/js/mustache"
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

var info = `<div class="table_of_contents_container">

	<table class="table_of_contents">
		<tr><th>CONTENTS</th></tr>
		{{#headings}}
		<tr><td data-id="{{index}}">{{heading}}</td></tr>
		{{/headings}}
	</table>

</div>`

class Tableizer {

	constructor() {

        this.toc = document.querySelector("#toc")

        this.isMobile = this.mobileCheck()

        this.app = {}

        this.app.isApp = (window.location.origin === "file://" || window.location.origin === null || window.location.origin === "https://mobile.guardianapis.com") ? true : false ;

        this.app.isIos = this.ios()

        this.app.isAndroid = ( /(android)/i.test(navigator.userAgent) ) ? true : false ;

        this.app.isiPhone = ( /(iPhone)/i.test(navigator.platform) ) ? true : false ;

        this.app.isiPad = navigator.userAgent.match(/iPad/i) != null;

        this.app.isiPad = navigator.userAgent.match(/iPad/i) != null;

        this.app.isIframe = (parent !== window) ? false  : true ;

        this.parent = (this.app.isIframe) ? parent.document : document ; 

        if (this.app.isApp) {

            this.headings = this.parent.querySelectorAll(".article__body h2")

            if (this.headings.length < 1) {

                this.parent = parent.document 

                this.app.isIframe = true

                this.headings = this.parent.querySelectorAll(".article__body h2")

            }

        } else {

            this.headings = this.parent.querySelectorAll("#article h2")

            if (this.headings.length < 1) {

                this.parent = parent.document 

                this.app.isIframe = true

                this.headings = this.parent.querySelectorAll("#article h2")

            }

        }
  
        this.getHeadlines()
    }

    getHeadlines() {

        var self = this

        var headings = []

        this.headings.forEach( (heads, index) => {

            //console.log(heads.classList, heads.innerHTML)

            var array = Array.from(heads.classList)

            console.log(array)

            var heading = heads.innerHTML.replace(/(<([^>]+)>)/ig,"");

            var cleaned = self.decodeHTMLEntities(heading)

            if (array.length < 1) {

                headings.push({ "heading" : cleaned, "index" : index })

            }

            //if (!['rich-link__title', 'rich-link__link', 'contributions__title'].every(item=>heads.classList.contains(item))) { //heads.classList.contains('rich-link__title')


        });

        this.createTable(headings)

    }

    decodeHTMLEntities(text) {
        var entities = [
            ['#x200B', ''],
            ['amp', '&']
        ];

        for (var i = 0, max = entities.length; i < max; ++i) 
            text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

        return text;
    }

    createTable(data) {

        var self = this

        var html = mustache(info, { "headings" : data } )

        this.toc.innerHTML = html

        if (data.length > 0) {

            this.toc.style.display = "inline-block";

        }

        this.showLocation(data)

        this.activateLinks()

    }

    activateLinks() {

        var self = this

        var buttons = document.querySelectorAll(`.table_of_contents td`); 

        buttons.forEach( (button, index) => {

            var id = +button.getAttribute('data-id');

            var target = self.headings[id]

            button.addEventListener('click',() => {

                console.log(id)

                self.scrollTo(target)

            });

        });

        var toc = this.parent.querySelector(`[data-atom-id='interactives/2020/04/tableizer/default']`);

        this.parent.querySelectorAll('h2').forEach(elem => {

            elem.addEventListener('click',() => {

                self.scrollTo(toc)

            });

        });

    }

    scrollTo(element) {

        var self = this

        setTimeout(function() {

            var elementTop = (self.app.isIframe) ? window.parent.pageYOffset + element.getBoundingClientRect().top : window.pageYOffset + element.getBoundingClientRect().top

            if (self.app.isIframe) {

                window.parent.scroll({

                  top: elementTop,

                  behavior: "smooth"

                });

            } else {

                window.scroll({

                  top: elementTop,

                  behavior: "smooth"

                });

            }


        }, 100);

    }

    showLocation(headings) {

    	var html = ""

    	html += `App: ${this.app.isApp}<br/>`

    	html += `iOS: ${this.app.isIos}<br/>`

    	html += `Android: ${this.app.isAndroid}<br/>`

    	html += `iPhone: ${this.app.isiPhone}<br/>`

    	html += `isiPad: ${this.app.isiPad}<br/>`

    	html += `Window: ${window.location.origin}<br/>`

    	html += `iFrame: ${this.app.isIframe}<br/><br/>`

    	//console.log(this.app)

        //console.log(headings)

    }

    ios() {

      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ];

      if (!!navigator.platform) {
        while (iDevices.length) {
          if (navigator.platform === iDevices.pop()){ return true; }
        }
      }

      return false;

    }

    mobileCheck() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        var isiPad = navigator.userAgent.match(/iPad/i) != null;
        return (check || isiPad ? true : false);
    }


}

var tableizer = new Tableizer()