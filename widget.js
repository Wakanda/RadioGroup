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
            defaultValue: "",
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
                m = '<label for="'+this.name()+'" class="radio-inline">\n'+m+'\n</label>\n';
            } else {
                m = '<div class="radio"><label for="'+this.name()+'">'+m+'</label></div>';
            }

            return m;
        },
        _selectedIndex: function() {
            var radioButtons = $(this.node).find("input");
            var selectedIndex = radioButtons.index(radioButtons.filter(':checked'));
            return selectedIndex;
        },
        disable: function(state) {
            if (state) {
                $(this.node).find("input").attr("disabled", "disabled").addClass("disabled");
            } else {
                $(this.node).find("input").attr("disabled", "").removeClass("disabled");
            }
            
        },
        init: function() {
 	        var that = this;
            select.prototype.init.call(this);

            if (this.name() === "") {
                this.name(this.id);
            }

            this.name.onChange(function(){ this.items.getPage(this.render); });
            this.inline.onChange(function(){ this.items.getPage(this.render); });

            if(this.selectItem()) {
                this._selectSubscriber = this.items.subscribe('currentElementChange', function() {
                    var position = this.items().getPosition();
                    $($(that.node).find("input")[position]).attr('checked', true);
                    this._setValueByPosition(position);
                }, this);
            }

            $(this.node).on('mousedown', function(event) {

                var node = event.target;
                if(node.tagName === 'LABEL') {
                    node = node.getElementsByTagName("input")[0];
                }
                if(node.tagName !== 'INPUT') {
                    return;
                }
                var $node = $(node);

                if(node.checked) { // && that.allowEmpty()
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
                    var position = that._selectedIndex();
                    that._setValueByPosition(position);
                }

            });
        }
    });

    if (radio.multiple)
    	radio.removeProperty("multiple");
    
    radio.removeProperty("allowEmpty");
    radio.removeClass("form-control");

    return radio;

});