<template>
  <modal>
    <div class="overlay" @click="$emit('windChart-close')"></div>
    <div class="windBackgroundArea">
      <div class="windFieldTitle">
        <h4>풍향별 풍속빈도</h4>
        <span>(단위 : %)</span>
      </div>
      <div id="windCountGraph">
        <table>
          <thead>
          <tr class="head_title">
            <th>m/s</th>
            <th>~5</th>
            <th>~8</th>
            <th>~11</th>
            <th>11~</th>
            <th>합계</th>
          </tr>
          <tr class="head_subTitle">
            <th></th>
            <th class="legend_1"></th>
            <th class="legend_2"></th>
            <th class="legend_3"></th>
            <th class="legend_4"></th>
            <th></th>
          </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="windFieldCloseArea">
        <button class="windFieldClose" @click="windClose">닫기</button>
      </div>
    </div>
  </modal>
</template>

<script>
import windrose from '../statistics/chart_attribute/windrose.js';
import $ from 'jquery';

export default {
  data: function () {
    return {
      getWindData: windrose,
      windData: [],
    };
  },
  mounted() {
    this.getWindTableData();
  },
  methods: {
    getWindTableData() {
      this.windData = this.getWindData.getWindTableCallFunction();
      let color = this.windData['color'];
      let direction = this.windData['direction'];
      let spdSize = this.windData['spdSize'];
      let dirSize = this.windData['dirSize'];
      let percentData = this.windData['percentData'];

      $('#windCountGraph table > tbody > tr > td').empty();
      $('.head_subTitle th').each(function (index) {
        const t = $(this);
        if (index > 0) {
          t.css('background-color', color[index]);
        }
      });
      /*scss 적용이 도저히 되지 않아 강제로 인라인 적용*/
      for (let dirIndex = 0; dirIndex < dirSize; dirIndex++) {
        let sum = 0;
        const tr = $('<tr class="windRoseTableBody ' + (dirIndex % 2 == 0 ? "even":"odd") + '" style="'+ (dirIndex % 2 == 0 ? "background:#303d44":"background:#18252B") +'">');
        tr.append("<td class='windRoseDirection' style='background: #4e616a; width: 16%'>" + direction[dirIndex] + "</td>");
        for (let spdIndex = 1; spdIndex < spdSize; spdIndex++) {
          const value = percentData[spdIndex][dirIndex];
          if (value > 0) {
            tr.append("<td style='width: 16%'>" + value.toFixed(2) + "</td>");
            sum += value;
          } else {
            tr.append("<td style='width: 16%'></td>");
          }
        }

        if (sum > 0) {
          tr.append("<td style='width: 16%'>" + sum.toFixed(2) + "</td>");
        } else {
          tr.append("<td style='width: 16%'></td>");
        }

        $('#windCountGraph table > tbody:last-child').append(tr);
      }

      $('#windCountGraph table').css('display', 'table');
    },
    windClose(){
      this.$emit('windChart-close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/popup/windChartPopup";
</style>
