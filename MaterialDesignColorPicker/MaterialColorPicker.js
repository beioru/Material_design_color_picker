
picker=(function(){ 
  return { 
      picker:false,
      portal:false,
      selected_group:0,
      selected_color:0,
      is_shown:false,
      color_arr:[],
      is_active:false,
      target:false,
      input:false,
      init_color:false,
//Initialisation
      init:function(){
      var all_pickers = document.getElementsByClassName('mcpicker');
      for (var i = 0; i < all_pickers.length; i++) {
         picker.init_one(all_pickers[i]);
      };
      },
      create_picker:function(){
         picker.picker = document.createElement('div');
         picker.picker.classList.add('bg-mod');
         picker.picker.id = 'mcpicker';
         picker.picker.style.opacity = '0';
         document.body.appendChild(picker.picker);
         picker.picker.innerHTML=picker.template();
         window.addEventListener('resize', picker.hide, false);
      },
      init_one:function(portal){
         picker.addShowEvent(portal);
         var color=portal.getAttribute('data-color');
            if(color){
               picker.find_color(color);
               picker.set_element_color(portal);
            }
            portal.innerHTML=(color)?color:'no color';
            portal.classList.add('dark');

            if(!picker.picker) picker.create_picker();
      },
      new:function(id, color, callback, active, target, input){
         var new_mcpicker=document.getElementById(id);
         new_mcpicker.innerHTML='<div class="mcpicker" '+
         (color?' data-color="'+color+'"  ':'')+
         (callback?' data-callback="'+callback+'"':'')+
         (target?' data-target="'+target+'"':'')+
         (active?' data-active="'+active+'"':'')+
         ' onclick="picker.show();"></div>';
         picker.init_one(new_mcpicker.firstChild);
      },
      set_element_color:function(element){
         element.style.backgroundColor='#'+picker.color_arr.color;
         element.classList.remove(((picker.color_arr.mod=='dark')?'light':'dark'));
         element.classList.add((picker.color_arr.mod=='dark')?'dark':'light');
      },

      addShowEvent:function(element){
         element.addEventListener('click', picker.show, false);
      },
      set_status:function() {
         picker.set(picker.init_color);
         if(picker.is_active&&(picker.color_arr.weight.charAt(0)!='A')) picker.toggleactive();
         else if(!picker.is_active&&picker.init_active) picker.toggleactive();
      },
      write_status:function() {
         picker.portal.setAttribute('data-color','#'+picker.color_arr.color);
         picker.portal.innerHTML=(picker.color_arr.color)?'#'+picker.color_arr.color:'no color';
      },
      get_data_ret_obj:function(data_name) {
         var value=picker.portal.getAttribute('data-'+data_name);
         if(value) return document.getElementById(value);
         else return false;
      },
      read_status:function() {
         picker.target=picker.get_data_ret_obj('target');
         picker.input=picker.get_data_ret_obj('input');
         picker.callback=picker.portal.getAttribute('data-callback');
         picker.init_color=picker.portal.getAttribute('data-color')||0;
         picker.init_active=picker.portal.getAttribute('data-active')=='true';
      },
      clear_active_class:function(){
         if(picker.picker.classList.contains('subcolor'))
            picker.picker.classList.remove('subcolor');
         if(picker.selected_group&&picker.selected_group!=0){
            document.getElementById('color_group_'+picker.selected_group).classList.remove('active_group');
            document.getElementById('color_'+picker.selected_group+'_'+picker.selected_color).classList.remove('active_color');
         }
      },
      setup_active_class:function(){
         if(!picker.picker.classList.contains('subcolor'))
               picker.picker.classList.add('subcolor');
            document.getElementById('color_group_'+picker.selected_group).classList.add('active_group');
            document.getElementById('color_'+picker.selected_group+'_'+picker.selected_color).classList.add('active_color');
      },
      set:function(color){
         picker.clear_active_class();
         if(picker.find_color(color)){
            if((picker.color_arr.weight.charAt(0)=='A')&&!picker.is_active) picker.toggleactive();
            picker.setup_active_class();
         }
         picker.colorize_header();
      },
      colorize_header: function() {
         var result=document.getElementById('mcpicker_result'),
         header=document.getElementById('mcpicker_header');
            picker.set_element_color(header);
            picker.set_element_color(result);
            result.value='#'+picker.color_arr.color;
      },
      move_to_portal: function() {
         var x = picker.portal.offsetLeft+50, 
             y = picker.portal.offsetTop,
             w = document.body.clientWidth,
             h = document.body.clientHeight;
             x = (x+210>=w)?(w-210):((x<0)?10:x);
             y = (y+400>=h)?(h-210):((y<0)?10:y);
         picker.picker.style.top = y+'px';
         picker.picker.style.left = x+'px';
      },
      toggleactive: function() {
         picker.is_active=picker.is_active?false:true;
         picker.picker.classList.remove(picker.is_active?'bg-mod':'active-mod');
         picker.picker.classList.add(picker.is_active?'active-mod':'bg-mod');
         document.getElementById('mcpicker_switch').style.opacity=(picker.is_active)?1:0.2;
      },
      show_animation: function(event) {
         picker.picker.style.visibility = 'visible';
         picker.picker.style.opacity = '1';
         picker.picker.style.maxHeight = '400px';
      },
      hide_animation: function(event) {
         picker.picker.style.left=(picker.portal.offsetLeft-50)+'px';
         picker.picker.style.visibility = 'hidden';
         picker.picker.style.opacity = '0';
         picker.picker.style.maxHeight = '0px';
      },
      show: function(event) {
         picker.is_shown=true;
         var e = event || window.event; picker.portal= e.target || e.srcElement; 
         picker.read_status();
         picker.set_status();
         picker.move_to_portal();
         picker.show_animation();
      },
      hide: function(save) {
         if(picker.is_shown){
            if(save==true) picker.apply_result();
            picker.hide_animation();
            picker.is_shown=false;
         }
      },
      click: function(color){
         picker.set(color);
      },
      call_callback: function(callback_name){
         if(callback_name){ 
            var parts = callback_name.split('.');
            var method = window;
            for (var i = 0; i < parts.length; i++) {
               method = method[parts[i]];
            }
            if(method&&i>0) return method;
         }
         return false;
      },
      apply_result: function(){
         if(picker.selected_group&&picker.selected_group!=0){
            var color='#'+picker.color_arr.color;
            var lightness=(picker.color_arr.mod=='dark')?'dark':'light';
            picker.set_element_color(picker.portal);
            if(picker.callback)(picker.call_callback(picker.callback))(color, lightness);
            if(picker.target) picker.set_element_color(picker.target);
            if(picker.input) picker.input.value=color;
            picker.write_status();
         }
      },
      find_color: function(color) {
         if(color){
            if(color.charAt(0)=='#') color=color.substring(1,7);
            color=color.toLowerCase();
            for (var i = 1; i < picker.color.length; i++) {
               for (var j = 0; j < picker.color[i].length; j++) {
                  if(picker.color[i][j].color==color){
                     picker.selected_group=i;
                     picker.selected_color=j;
                     picker.color_arr=picker.color[i][j];
                     return true;
                  }
               }
            }
         }
         picker.selected_group=0;
         picker.selected_color=0;
         picker.color_arr=picker.color[0][0];
         return false;
      },
      template: function() {
         var  str, exit, sw, back, save,  sw, main_color, active_color;
         exit='<svg   height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
         sw='A';
         back='<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';
         save='<svg  height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">    <path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
         
         str='<div id="mcpicker_header"><div id="mcpicker_switch" onclick="picker.toggleactive();">'+sw+'</div><input type="text" id="mcpicker_result" onfocus="this.select();"><div id="mcpicker_close" onclick="picker.hide()">'+exit+'</div></div>';
            for (var i = 1; i < picker.color.length; i++) {
              str+='<div class="color-group" id="color_group_'+i+'"><div onclick="picker.click(0);" class="color dark">'+back+'</div>';
                 for (var j = 0; j < picker.color[i].length; j++) {
                   main_color=(picker.color[i][j].weight=='500'||picker.color[i][j].weight=='A400')?' main-color':'';
                   mod=(picker.color[i][j].mod=='dark')?' dark':' light';
                   active_color=(picker.color[i][j].weight.charAt(0)=='A')?' active-color':' bg-color';
                   str+='<div  onclick="picker.click(\'#'+picker.color[i][j].color+'\');" id="color_'+i+'_'+j+'" class="color'+mod+active_color+main_color+'" style="background-color: #'+picker.color[i][j].color+';"><span class="shade">'+picker.color[i][j].weight+'</span></div>';
                 };
              str+='<div onclick="picker.hide(true)" class="color dark" >'+save+'</div></div>';
            };
         return str+'';
      },
  color:
  [   
    [
      {
         color:'263238', 
         type: 'expanded', 
         weight: '900'
      }
      
    ],
    [
      {
         mod:'dark',
         color:'ffebee', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'ffcdd2', 
         weight: '100'},
      {
         mod:'dark',
         color:'ef9a9a', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'e57373', 
         weight: '300'},
      {
         color:'ef5350', 
         type: 'expanded', 
         weight: '400'},
      {
         color:'f44336', 
         weight: '500'},
      {
         color:'e53935', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'d32f2f', 
         weight: '700'},
      {
         color:'c62828', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'b71c1c', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'ff8a80', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'light-strong',
         color:'ff5252', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         color:'ff1744', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         color:'d50000', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'fce4ec', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'f8bbd0', 
         weight: '100'},
      {
         mod:'dark',
         color:'f48fb1', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'light-strong',
         color:'f06292', 
         weight: '300'},
      {
         mod:'',
         color:'ec407a', 
         type: 'expanded', 
         weight: '400'},
      {
         color:'e91e63', 
         weight: '500'},
      {
         color:'d81b60', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'c2185b', 
         weight: '700'},
      {
         color:'ad1457', 
         weight: '800'},
      {
         color:'880e4f', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'ff80ab', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'light-strong',
         color:'ff4081', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         color:'f50057', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         color:'c51162', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'f3e5f5', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'e1bee7', 
         weight: '100'},
      {
         mod:'dark',
         color:'ce93d8', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'light-strong',
         color:'ba68c8', 
         weight: '300'},
      {
         mod:'light-strong',
         color:'ab47bc', 
         type: 'expanded', 
         weight: '400'},
      {
         color:'9c27b0', 
         weight: '500'},
      {
         color:'8e24aa', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'7b1fa2', 
         weight: '700'},
      {
         color:'6a1b9a', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'4a148c', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'ea80fc', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'light-strong',
         color:'e040fb', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         color:'d500f9', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         color:'aa00ff', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'ede7f6', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'d1c4e9', 
         weight: '100'},
      {
         mod:'dark',
         color:'b39ddb', 
         type: 'expanded', 
         weight: '200'},
      {
         color:'9575cd', 
         weight: '300'},
      {
         color:'7e57c2', 
         type: 'expanded', 
         weight: '400'},
      {
         color:'673ab7', 
         weight: '500'},
      {
         color:'5e35b1', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'512da8', 
         weight: '700'},
      {
         color:'4527a0', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'311b92', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'b388ff', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'light-strong',
         color:'7c4dff', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         color:'651fff', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         color:'6200ea', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'e8eaf6', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'c5cae9', 
         weight: '100'},
      {
         mod:'dark',
         color:'9fa8da', 
         type: 'expanded', 
         weight: '200'},
      {
         color:'7986cb', 
         weight: '300'},
      {
         color:'5c6bc0', 
         type: 'expanded', 
         weight: '400'},
      {
         color:'3f51b5', 
         weight: '500'},
      {
         color:'3949ab', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'303f9f', 
         weight: '700'},
      {
         color:'283593', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'1a237e', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'8c9eff', 
         type: 'accent', 
         weight: 'A100'},
      {
         color:'536dfe', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         color:'3d5afe', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         color:'304ffe', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'e3f2fd', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'bbdefb', 
         weight: '100'},
      {
         mod:'dark',
         color:'90caf9', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'64b5f6', 
         weight: '300'},
      {
         mod:'dark',
         color:'42a5f5', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'light-strong',
         color:'2196f3', 
         weight: '500'},
      {
         color:'1e88e5', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'1976d2', 
         weight: '700'},
      {
         color:'1565c0', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'0d47a1', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'82b1ff', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'light-strong',
         color:'448aff', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         color:'2979ff', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         color:'2962ff', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'e1f5fe', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'b3e5fc', 
         weight: '100'},
      {
         mod:'dark',
         color:'81d4fa', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'4fc3f7', 
         weight: '300'},
      {
         mod:'dark',
         color:'29b6f6', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'dark',
         color:'03a9f4', 
         weight: '500'},
      {
         mod:'light-strong',
         color:'039be5', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'0288d1', 
         weight: '700'},
      {
         color:'0277bd', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'01579b', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'80d8ff', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'40c4ff', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         mod:'dark',
         color:'00b0ff', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         mod:'light-strong',
         color:'0091ea', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'e0f7fa', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'b2ebf2', 
         weight: '100'},
      {
         mod:'dark',
         color:'80deea', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'4dd0e1', 
         weight: '300'},
      {
         mod:'dark',
         color:'26c6da', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'dark',
         color:'00bcd4', 
         weight: '500'},
      {
         mod:'dark',
         color:'00acc1', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'0097a7', 
         weight: '700'},
      {
         color:'00838f', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'006064', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'84ffff', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'18ffff', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         mod:'dark',
         color:'00e5ff', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         mod:'dark',
         color:'00b8d4', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'e0f2f1', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'b2dfdb', 
         weight: '100'},
      {
         mod:'dark',
         color:'80cbc4', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'4db6ac', 
         weight: '300'},
      {
         mod:'dark',
         color:'26a69a', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'light-strong',
         color:'009688', 
         weight: '500'},
      {
         mod:'light-strong',
         color:'00897b', 
         type: 'expanded', 
         weight: '600'},
      {
         mod:'light-strong',
         color:'00796b', 
         weight: '700'},
      {
         color:'00695c', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'004d40', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'a7ffeb', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'64ffda', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         mod:'dark',
         color:'1de9b6', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         mod:'dark',
         color:'00bfa5', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'e8f5e9', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'c8e6c9', 
         weight: '100'},
      {
         mod:'dark',
         color:'a5d6a7', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'81c784', 
         weight: '300'},
      {
         mod:'dark',
         color:'66bb6a', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'dark',
         color:'4caf50', 
         weight: '500'},
      {
         mod:'light-strong',
         color:'43a047', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'388e3c', 
         weight: '700'},
      {
         color:'2e7d32', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'1b5e20', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'b9f6ca', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'69f0ae', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         mod:'dark',
         color:'00e676', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         mod:'dark',
         color:'00c853', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'f1f8e9', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'dcedc8', 
         weight: '100'},
      {
         mod:'dark',
         color:'c5e1a5', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'aed581', 
         weight: '300'},
      {
         mod:'dark',
         color:'9ccc65', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'dark',
         color:'8bc34a', 
         weight: '500'},
      {
         mod:'dark',
         color:'7cb342', 
         type: 'expanded', 
         weight: '600'},
      {
         mod:'light-strong',
         color:'689f38', 
         weight: '700'},
      {
         color:'558b2f', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'33691e', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'ccff90', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'b2ff59', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         mod:'dark',
         color:'76ff03', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         mod:'dark',
         color:'64dd17', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'f9fbe7', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'f0f4c3', 
         weight: '100'},
      {
         mod:'dark',
         color:'e6ee9c', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'dce775', 
         weight: '300'},
      {
         mod:'dark',
         color:'d4e157', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'dark',
         color:'cddc39', 
         weight: '500'},
      {
         mod:'dark',
         color:'c0ca33', 
         type: 'expanded', 
         weight: '600'},
      {
         mod:'dark',
         color:'afb42b', 
         weight: '700'},
      {
         mod:'dark',
         color:'9e9d24', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'827717', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'f4ff81', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'eeff41', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         mod:'dark',
         color:'c6ff00', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         mod:'dark',
         color:'aeea00', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'fffde7', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'fff9c4', 
         weight: '100'},
      {
         mod:'dark',
         color:'fff59d', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'fff176', 
         weight: '300'},
      {
         mod:'dark',
         color:'ffee58', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'dark',
         color:'ffeb3b', 
         weight: '500'},
      {
         mod:'dark',
         color:'fdd835', 
         type: 'expanded', 
         weight: '600'},
      {
         mod:'dark',
         color:'fbc02d', 
         weight: '700'},
      {
         mod:'dark',
         color:'f9a825', 
         type: 'expanded', 
         weight: '800'},
      {
         mod:'dark',
         color:'f57f17', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'ffff8d', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'ffff00', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         mod:'dark',
         color:'ffea00', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         mod:'dark',
         color:'ffd600', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'fff8e1', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'ffecb3', 
         weight: '100'},
      {
         mod:'dark',
         color:'ffe082', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'ffd54f', 
         weight: '300'},
      {
         mod:'dark',
         color:'ffca28', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'dark',
         color:'ffc107', 
         weight: '500'},
      {
         mod:'dark',
         color:'ffb300', 
         type: 'expanded', 
         weight: '600'},
      {
         mod:'dark',
         color:'ffa000', 
         weight: '700'},
      {
         mod:'dark',
         color:'ff8f00', 
         type: 'expanded', 
         weight: '800'},
      {
         mod:'dark',
         color:'ff6f00', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'ffe57f', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'ffd740', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         mod:'dark',
         color:'ffc400', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         mod:'dark',
         color:'ffab00', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'fff3e0', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'ffe0b2', 
         weight: '100'},
      {
         mod:'dark',
         color:'ffcc80', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'ffb74d', 
         weight: '300'},
      {
         mod:'dark',
         color:'ffa726', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'dark',
         color:'ff9800', 
         weight: '500'},
      {
         mod:'dark',
         color:'fb8c00', 
         type: 'expanded', 
         weight: '600'},
      {
         mod:'dark',
         color:'f57c00', 
         weight: '700'},
      {
         mod:'light-strong',
         color:'ef6c00', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'e65100', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'ffd180', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'ffab40', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         mod:'dark',
         color:'ff9100', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         mod:'dark',
         color:'ff6d00', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'fbe9e7', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'ffccbc', 
         weight: '100'},
      {
         mod:'dark',
         color:'ffab91', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'ff8a65', 
         weight: '300'},
      {
         mod:'dark',
         color:'ff7043', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'light-strong',
         color:'ff5722', 
         weight: '500'},
      {
         color:'f4511e', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'e64a19', 
         weight: '700'},
      {
         color:'d84315', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'bf360c', 
         type: 'expanded', 
         weight: '900'},
      {
         mod:'dark divide',
         color:'ff9e80', 
         type: 'accent', 
         weight: 'A100'},
      {
         mod:'dark',
         color:'ff6e40', 
         type: 'accent expanded', 
         weight: 'A200'},
      {
         color:'ff3d00', 
         type: 'accent expanded', 
         weight: 'A400'},
      {
         color:'dd2c00', 
         type: 'accent', 
         weight: 'A700'}
    ],
    [
      {
         mod:'dark',
         color:'efebe9', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'d7ccc8', 
         weight: '100'},
      {
         mod:'dark',
         color:'bcaaa4', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'light-strong',
         color:'a1887f', 
         weight: '300'},
      {
         color:'8d6e63', 
         type: 'expanded', 
         weight: '400'},
      {
         color:'795548', 
         weight: '500'},
      {
         color:'6d4c41', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'5d4037', 
         weight: '700'},
      {
         color:'4e342e', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'3e2723', 
         type: 'expanded', 
         weight: '900'}
    ],
    [
      {
         mod:'dark',
         color:'fafafa', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'f5f5f5', 
         weight: '100'},
      {
         mod:'dark',
         color:'eeeeee', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'e0e0e0', 
         weight: '300'},
      {
         mod:'dark',
         color:'bdbdbd', 
         type: 'expanded', 
         weight: '400'},
      {
         mod:'dark',
         color:'9e9e9e', 
         weight: '500'},
      {
         color:'757575', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'616161', 
         weight: '700'},
      {
         color:'424242', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'212121', 
         type: 'expanded', 
         weight: '900'}
    ],
    [
      {
         mod:'dark',
         color:'eceff1', 
         type: 'expanded', 
         weight: '50'},
      {
         mod:'dark',
         color:'cfd8dc', 
         weight: '100'},
      {
         mod:'dark',
         color:'b0bec5', 
         type: 'expanded', 
         weight: '200'},
      {
         mod:'dark',
         color:'90a4ae', 
         weight: '300'},
      {
         mod:'light-strong',
         color:'78909c', 
         type: 'expanded', 
         weight: '400'},
      {
         color:'607d8b', 
         weight: '500'},
      {
         color:'546e7a', 
         type: 'expanded', 
         weight: '600'},
      {
         color:'455a64', 
         weight: '700'},
      {
         color:'37474f', 
         type: 'expanded', 
         weight: '800'},
      {
         color:'263238', 
         type: 'expanded', 
         weight: '900'}
    ],
    [
      {
         color:'000000', 
         type: 'accent expanded', 
         weight: '500'},
      {
         mod:'dark',
         color:'ffffff', 
         type: 'accent expanded', 
         weight: '000'}
    ]
  ]
}//return
})();
picker.init();
