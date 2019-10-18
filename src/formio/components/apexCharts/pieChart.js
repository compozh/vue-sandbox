/* eslint-disable */
import HtmlelementComponent from 'formiojs/components/html/HTML';

/* eslint-disable */
class PieChart extends HtmlelementComponent {
	redraw () { 
		return true;
	}

	static schema (...extend) {
		return super.schema({
			type: 'piechart',
			label: 'chartelement',
			content: '<div id="piechart"/>',
			attrs: [
				{
					attr: "labels",
					value: "[]"
				},
				{
					attr: "series",
					value: "[]"
				}
			],
			logic: [
				{
					name: "Chart logic",
					trigger: {
						type: "javascript",
						javascript: "var labels = [],\n  series = [];\nif(component.attrs) {\n  component.attrs.forEach(attribute => {\n    switch(attribute.attr) {\n      case 'labels':\n        labels = JSON.parse(attribute.value);\n        break;\n      case 'series':\n        series = JSON.parse(attribute.value);\n        break;\n    }\n  });\n}\nvar options = {\n            chart: {\n                width: 380,\n                type: 'pie',\n            },\n            labels: labels,\n            series: series,\n            responsive: [{\n                breakpoint: 480,\n                options: {\n                    chart: {\n                        width: 200\n                    },\n                    legend: {\n                        position: 'bottom'\n                    }\n                }\n            }]\n        }\n        \n        var chart = new ApexCharts(\n            document.querySelector(\"#piechart\"),\n            options\n        );\n        \n        chart.render();"
					},
					actions: []
				}
			]
		});
	}

	static get builderInfo() {
		return {
			title: 'Pie Chart',
			group: 'customBasic',
			icon: 'pie-chart',
			weight: 70,
			schema: this.schema()
		}
	}
}

Formio.registerComponent('piechart', PieChart)