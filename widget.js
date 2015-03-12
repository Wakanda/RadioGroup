var aa;
WAF.define('RadioGroup', ['waf-core/widget', 'Select'], function(widget, select) {
    "use strict";

    var radio = widget.create('RadioGroup', select, {
        tagName: 'DIV',
        inline: widget.property({
            type: 'boolean',
            description: "",
            defaultValue: false,
            bindable: false
        }),
        name: widget.property({
            type: 'string',
            description: "",
            defaultValue: "radioGroup",
            bindable: false
        }),
        getSelectedIndex: function() {
            return $('input:checked', this.node).parent().index();
        },
        _staticValueCallback : function() {
             var v = [],
                label,
                val,
                lis = this.node.getElementsByTagName("label");

            lis = Array.prototype.slice.call(lis);

            function buildItems(item, index, array) {

                label = item.innerText || "";
                val = item.getElementsByTagName('input')[0].value || "";

                v.push({label: label, value: val});
            }

            lis.forEach(buildItems);

            return v;
        },
        _valueChangeHandler: function() {
            var value = this.value();
            var opt = $('[value=' + (value || '') + ']', this.node).get(0);
            if(opt) {
                opt.checked = true;
            } else {
                this.fire('errorNotFound');
            }
        },
        _getMarkup: function(o, position, index) {
            var label = o.label || "",
                v = o.value || "",
                m;

            m = '<input type="radio" name="'+this.name()+'" value="'+v+'">\n' + label;

            if (this.inline()) {
                m = '<label class="radio-inline">\n'+m+'\n</label>\n';
            } else {
                m = '<div class="radio"><label>'+m+'</label></div>';
            }

            return m;
        },
        init: function() {
 	        var that = this;
            select.prototype.init.call(this);
 
            this.name.onChange(function(){ this.items.getPage(this.render); });
            this.inline.onChange(function(){ this.items.getPage(this.render); });
 
            $(this.node).on('mousedown', function(event) {
                var node = event.target;
                if(node.tagName === 'LABEL') {
                    node = document.getElementById(node.for);
                }
                if(node.tagName !== 'INPUT') {
                    return;
                }
                var $node = $(node);
                if(node.checked && that.allowEmpty()) {
                    var uncheck = function(){
                        setTimeout(function() {
                            node.checked = false;
                            that._setValueByPosition(-1);
                        }, 0);
                    };
                    var unbind = function(){
                        $node.unbind('mouseup', up);
                    };
                    var up = function(){
                        uncheck();
                        unbind();
                    };
                    $node.bind('mouseup', up);
                    $node.one('mouseout', unbind);
                } else {
                    node.checked = true;
                    var position = that.getSelectedIndex();
                    that._setValueByPosition(position);
                }

            });
        }
    });

    if (radio.multiple)
    	radio.removeProperty("multiple");

    radio.removeClass("form-control");

    return radio;

});