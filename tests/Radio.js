var klassName = 'Radio';

describe("Test Widget/"+klassName+" :", function() {

	before(function(){
        errorClass = WAF.require('waf-core/error');
    });

    it("core should be loaded",function(){
        expect(WAF).to.not.equal(undefined);
        expect(WAF.require).to.be.an('function');
    });

    it("error class should be loaded",function(){
        expect(errorClass).to.be.an('object');
    });

    var klass = WAF.require(klassName);
    var widget = new klass();

    //set basic data for property item
	widget.items.push({label:"hello", value:"thevalue"});
	widget.items.push({label:"hello2", value:"thevalue2"});

	if(widget){

		it('should return a '+klassName+' Widget', function() {
			expect(widget).to.be.a('object').and.to.be.not.undefined;
		});

		// CORE
		it('should register the widget', function() {
			expect(WAF.widgets[widget.id]).to.be.a('object').and.to.be.not.undefined;
		});

		// HTML TEST
		it('should retrieve the id', function() {
			expect(widget.id).to.be.a('string').and.equal(widget.node.id);
		});
		it('should retrieve the kind', function() {
			expect(widget.kind).to.be.a('string').and.equal(widget.node.dataset.type);
		});
		it('should generate a proper html tag', function() {
			expect(widget.kind).to.be.a('string').and.equal(widget.node.dataset.type);
		});

		// PROPERTIES TEST
		it('should disable the widget', function() {
			widget.disable();
			expect(widget._enabled).to.be.false;
		});

		it('should enable the widget', function() {
			widget.enable();
			expect(widget._enabled).to.be.true;
		});

		it('should set the radio group name', function() {
			widget.name("hello");
			var node = widget.node.querySelectorAll("input[name='hello']");
			expect(node.length).to.be.equal(2);
		});

		it('should switch to inline radio', function() {
			widget.inline(true);
			var node = widget.node.querySelectorAll("label")[0];
			expect(node.classList.contains("radio-inline")).to.be.true;
		});

		it('should switch to not inline radio', function() {
			widget.inline(false);
			var node = widget.node.querySelectorAll("label")[0];
			expect(node.classList.contains("radio-inline")).to.be.false;
			expect(node.parentNode.classList.contains("radio")).to.be.true;
		});

		it('Should add item to the property items', function() {
			expect(widget.items()[0].label).to.be.a('string').and.equal("hello");
			expect(widget.items()[0].value).to.be.a('string').and.equal("thevalue");
		});

		it('Should move item to the given positions in the property items', function() {
			widget.items.move(0,1);
			expect(widget.items()[0].label).to.be.a('string').and.equal("hello2");
			expect(widget.items()[0].value).to.be.a('string').and.equal("thevalue2");
		});

		it('Should remove item to from the property items', function() {
			widget.items.remove(0);
			expect(widget.items()[0].label).to.be.a('string').and.equal("hello");
		});

		// CLONE
		it('should clone the widget', function() {
			var clonedWidget = widget.clone();
			expect(WAF.widgets[clonedWidget.id]).to.be.not.undefined;
		});

		// DESTROY
		it('should destroy the widget', function() {
			widget.destroy();
			expect(WAF.widgets[widget.id]).to.be.undefined;
		});

	}
});